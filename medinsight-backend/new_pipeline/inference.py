# new_pipeline/inference.py

import cv2
import numpy as np
import torch
import torch.nn as nn
import timm
import torch.nn.functional as F
from pathlib import Path

from new_pipeline.stage0_orientation.correct_orientation import correct_orientation
from new_pipeline.stage1_rectification.rectify import build_rectified_image
from new_pipeline.stage1_rectification.detect_grid import detect_grid_intersections
from new_pipeline.stage2_lead_crop.crop_leads import crop_all_leads
from new_pipeline.stage2_lead_crop.blank_template import prepare_lead_inputs
from new_pipeline.stage4_signal_extraction.extract_signal import extract_leads_from_heatmaps
from new_pipeline.stage5_resampling.resample import resample_all_leads
from new_pipeline.stage6_postprocessing.postprocess import postprocess_leads, leads_to_array
from new_pipeline.stage7_classification.classify import load_classifier, classify_ecg


# ── Model Architecture (same as training) ────────────────────────────────────
class ConvBnGelu(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1),
            nn.BatchNorm2d(out_ch), nn.GELU())
    def forward(self, x): return self.block(x)

class DecoderBlock(nn.Module):
    def __init__(self, in_ch, skip_ch, out_ch):
        super().__init__()
        self.conv1 = ConvBnGelu(in_ch+skip_ch, out_ch)
        self.conv2 = ConvBnGelu(out_ch, out_ch)
    def forward(self, x, skip=None):
        x = F.interpolate(x, scale_factor=2,
                          mode='bilinear', align_corners=False)
        if skip is not None:
            if x.shape[2:] != skip.shape[2:]:
                skip = F.interpolate(skip, size=x.shape[2:],
                                     mode='bilinear', align_corners=False)
            x = torch.cat([x, skip], dim=1)
        return self.conv2(self.conv1(x))

class Series2DFusion(nn.Module):
    def __init__(self, ch):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(ch*4, ch, 1), nn.BatchNorm2d(ch), nn.GELU(),
            nn.Conv2d(ch, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.GELU())
    def forward(self, feats):
        return self.net(torch.cat(feats, dim=1))

class UltimateDualEncoderUNet(nn.Module):
    def __init__(self, in_channels=4):
        super().__init__()
        self.vgg = timm.create_model(
            'vgg19.tv_in1k', pretrained=False,
            features_only=True, in_chans=in_channels,
            out_indices=(1,2,3,4))
        self.vgg_ch = self.vgg.feature_info.channels()

        self.convnext = timm.create_model(
            'convnext_small.fb_in22k_ft_in1k', pretrained=False,
            features_only=True, in_chans=in_channels)
        self.cnx_ch = self.convnext.feature_info.channels()

        self.sf4 = Series2DFusion(self.vgg_ch[3]+self.cnx_ch[3])
        self.sf3 = Series2DFusion(self.vgg_ch[2]+self.cnx_ch[2])
        self.sf2 = Series2DFusion(self.vgg_ch[1]+self.cnx_ch[1])

        self.p4 = nn.Conv2d(self.vgg_ch[3]+self.cnx_ch[3], 512, 1)
        self.p3 = nn.Conv2d(self.vgg_ch[2]+self.cnx_ch[2], 384, 1)
        self.p2 = nn.Conv2d(self.vgg_ch[1]+self.cnx_ch[1], 256, 1)
        self.p1 = nn.Conv2d(self.vgg_ch[0]+self.cnx_ch[0], 128, 1)

        self.dec5 = DecoderBlock(512, 384, 256)
        self.dec4 = DecoderBlock(256, 256, 192)
        self.dec3 = DecoderBlock(192, 128, 160)

        self.head = nn.Sequential(
            nn.Conv2d(160, 64, 3, padding=1), nn.GELU(),
            nn.Conv2d(64, 1, 1))

    def encode(self, x):
        return self.vgg(x), self.convnext(x)

    def forward(self, series_list):
        av, ac = [], []
        for s in series_list:
            vf, cf = self.encode(s)
            av.append(vf); ac.append(cf)

        def cs(vi, ci):
            return [torch.cat([av[i][vi],
                F.interpolate(ac[i][ci], size=av[i][vi].shape[2:],
                              mode='bilinear', align_corners=False)
                ], dim=1) for i in range(4)]

        f4 = self.p4(self.sf4(cs(3,3)))
        f3 = self.p3(self.sf3(cs(2,2)))
        f2 = self.p2(self.sf2(cs(1,1)))
        f1 = torch.stack([self.p1(c) for c in cs(0,0)]).mean(0)

        out = []
        for i in range(4):
            x = self.dec5(f4, f3)
            x = self.dec4(x,  f2)
            x = self.dec3(x,  f1)
            x = F.interpolate(x, size=series_list[i].shape[2:],
                              mode='bilinear', align_corners=False)
            out.append(self.head(x))
        return out


# ── Pipeline Manager ──────────────────────────────────────────────────────────
class ECGPipelineManager:
    """
    Singleton — load models once, reuse for all requests.
    """
    _instance = None

    def __init__(self):
        self.device       = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.seg_model    = None
        self.classifier   = None
        self.models_loaded = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_models(self,
                     seg_weights:   str,
                     class_weights: str):
        """Load both models once at startup."""
        print(f"Loading models on {self.device}...")

        # Segmentation model
        self.seg_model = UltimateDualEncoderUNet(in_channels=4)

        # Handle DataParallel weights
        ckpt = torch.load(seg_weights, map_location=self.device)
        state = ckpt.get('model_state_dict', ckpt)

        # Remove 'module.' prefix if saved with DataParallel
        new_state = {}
        for k, v in state.items():
            new_state[k.replace('module.', '')] = v

        self.seg_model.load_state_dict(new_state)
        self.seg_model.eval()
        self.seg_model.to(self.device)
        print("✅ Segmentation model loaded")

        # Classification model
        self.classifier = load_classifier(class_weights, self.device)
        print("✅ Classifier loaded")

        self.models_loaded = True

    def run(self, image_path: str) -> dict:
        """
        Full pipeline: image → complete diagnostic report
        """
        if not self.models_loaded:
            raise RuntimeError("Models not loaded. Call load_models() first.")

        try:
            # ── Stage 0: Orientation ──────────────────────────────────────
            img = cv2.imread(image_path)
            if img is None:
                return {'status': 'error', 'message': 'Image not readable'}

            img = correct_orientation(img)

            # ── Stage 1: Rectification ────────────────────────────────────
            img_rect    = build_rectified_image(img)
            grid_points = detect_grid_intersections(img_rect)

            # ── Stage 2: Lead Crops ───────────────────────────────────────
            crops       = crop_all_leads(img_rect, grid_points)
            lead_inputs = prepare_lead_inputs(crops)

            # ── Stage 3: Model Inference ──────────────────────────────────
            series_list = self._prepare_series(lead_inputs)

            with torch.no_grad():
                heatmap_preds = self.seg_model(series_list)

            # ── Stage 4: Signal Extraction ────────────────────────────────
            heatmaps = [heatmap_preds[i][0,0].cpu().numpy()
                        for i in range(4)]
            leads = extract_leads_from_heatmaps(heatmaps)

            # ── Stage 5: Resampling ───────────────────────────────────────
            leads = resample_all_leads(leads, target_length=5000)

            # ── Stage 6: Post-processing ──────────────────────────────────
            leads = postprocess_leads(leads)
            ecg_array = leads_to_array(leads)  # (12, 5000)

            # ── Stage 7: Classification ───────────────────────────────────
            report = classify_ecg(ecg_array, self.classifier, self.device)

            return {
                'status':      'success',
                'ecg_signal':  ecg_array.tolist(),
                'report':      report,
            }

        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def _prepare_series(self, lead_inputs: dict) -> list:
        """Prepare 4 series tensors for model input."""
        from new_pipeline.stage2_lead_crop.blank_template import get_blank_template

        SERIES_LAYOUT = [
            ['I',   'aVR', 'V1',  'V4'],
            ['II',  'aVL', 'V2',  'V5'],
            ['III', 'aVF', 'V3',  'V6'],
            ['II_long'],
        ]

        series_tensors = []
        for row_leads in SERIES_LAYOUT:
            if len(row_leads) == 1:
                crop = lead_inputs.get(row_leads[0])
                if crop is None:
                    crop = lead_inputs.get('II', list(lead_inputs.values())[0])
            else:
                crops = [lead_inputs.get(n, np.zeros((212,550,4),
                          dtype=np.uint8)) for n in row_leads]
                crop  = np.concatenate(crops, axis=1)

            t = torch.from_numpy(
                crop.transpose(2,0,1)
            ).float().unsqueeze(0) / 255.0
            series_tensors.append(t.to(self.device))

        return series_tensors