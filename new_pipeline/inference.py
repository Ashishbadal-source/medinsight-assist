# new_pipeline/inference.py

import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from pathlib import Path
from ecg_pipeline.segmentation.unet import UNet

from new_pipeline.stage0_orientation.correct_orientation import correct_orientation
from new_pipeline.stage1_rectification.rectify import build_rectified_image
from new_pipeline.stage1_rectification.detect_grid import detect_grid_intersections
from new_pipeline.stage2_lead_crop.crop_leads import crop_all_leads
from new_pipeline.stage2_lead_crop.blank_template import prepare_lead_inputs
from new_pipeline.stage4_signal_extraction.extract_signal import extract_leads_from_heatmaps
from new_pipeline.stage5_resampling.resample import resample_all_leads
from new_pipeline.stage6_postprocessing.postprocess import postprocess_leads, leads_to_array
from new_pipeline.stage7_classification.classify import load_classifier, classify_ecg


# Unused architectures removed to ensure stability

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

        # Segmentation model (Pure PyTorch UNet)
        self.seg_model = UNet(in_channels=1, out_channels=1)

        # Handle DataParallel weights if necessary
        ckpt = torch.load(seg_weights, map_location=self.device)
        state = ckpt.get('model_state_dict', ckpt)

        # Remove 'module.' prefix
        new_state = {}
        for k, v in state.items():
            new_state[k.replace('module.', '')] = v

        self.seg_model.load_state_dict(new_state)
        self.seg_model.eval()
        self.seg_model.to(self.device)
        print("[OK] Segmentation model loaded")

        # Classification model
        self.classifier = load_classifier(class_weights, self.device)
        print("[OK] Classifier loaded")

        self.models_loaded = True

    def run(self, image_path: str) -> dict:
        """
        Full pipeline: image → complete diagnostic report
        """
        import sys
        if not self.models_loaded:
            raise RuntimeError("Models not loaded. Call load_models() first.")

        try:
            # --- Stage 0: Orientation ---
            print("STG 0: Correcting orientation...")
            sys.stdout.flush()
            img = cv2.imread(image_path)
            if img is None:
                return {'status': 'error', 'message': 'Image not readable'}

            img = correct_orientation(img)

            # --- Stage 1: Rectification ---
            print("STG 1: Rectification & Grid detection...")
            sys.stdout.flush()
            img_rect    = build_rectified_image(img)
            grid_points = detect_grid_intersections(img_rect)

            # --- Stage 2: Lead Crops ---
            print("STG 2: Cropping leads...")
            sys.stdout.flush()
            crops       = crop_all_leads(img_rect, grid_points)
            lead_inputs = prepare_lead_inputs(crops)

            # --- Stage 3: Model Inference ---
            print("STG 3: Segmentation (UNet) starting...")
            sys.stdout.flush()
            series_list = self._prepare_series(lead_inputs)

            with torch.no_grad():
                heatmap_preds = []
                for i, s in enumerate(series_list):
                    print(f"  Series {i}: Input shape {s.shape}")
                    sys.stdout.flush()
                    pred = self.seg_model(s)
                    heatmap_preds.append(pred)

            # --- Stage 4: Signal Extraction ---
            print("STG 4: Signal extraction from heatmaps...")
            sys.stdout.flush()
            
            heatmaps = []
            for i in range(4):
                h_pad = heatmap_preds[i][0,0].cpu().numpy()
                # Crop back to original lead sizes from stage 2
                # Rows 0-2 (i=0,1,2) are 4 leads wide, Row 3 is single long lead
                # But all have H=425 in Stage 2/3
                row_h, row_w = (425, 4400)
                heatmaps.append(h_pad[:row_h, :row_w])

            leads = extract_leads_from_heatmaps(heatmaps)

            # --- Stage 5: Resampling ---
            print("STG 5: Resampling leads...")
            sys.stdout.flush()
            leads = resample_all_leads(leads, target_length=5000)

            # --- Stage 6: Post-processing ---
            print("STG 6: Post-processing...")
            sys.stdout.flush()
            leads = postprocess_leads(leads)
            ecg_array = leads_to_array(leads)  # (12, 5000)

            # --- Stage 7: Classification ---
            print("STG 7: Classification...")
            sys.stdout.flush()
            report = classify_ecg(ecg_array, self.classifier, self.device)

            return {
                'status':      'success',
                'ecg_signal':  ecg_array.tolist(),
                'report':      report,
            }

        except Exception as e:
            import traceback
            print(f"PIPELINE ERROR: {str(e)}")
            traceback.print_exc()
            sys.stdout.flush()
            return {'status': 'error', 'message': str(e)}

    def _prepare_series(self, lead_inputs: dict) -> list:
        """Prepare 4 series tensors for model input with padding."""

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
                    crop = list(lead_inputs.values())[0]
            else:
                crops = [lead_inputs.get(n, np.zeros((425, 1100, 4), dtype=np.uint8)) for n in row_leads]
                crop  = np.concatenate(crops, axis=1) # (425, 4400, 4)

            # Convert to grayscale
            if crop.shape[2] == 4:
                gray = cv2.cvtColor(crop, cv2.COLOR_BGRA2GRAY)
            else:
                gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)

            # --- PAD TO MULTIPLE OF 32 ---
            h, w = gray.shape
            ph = ((h + 31) // 32) * 32
            pw = ((w + 31) // 32) * 32
            
            padded = np.zeros((ph, pw), dtype=np.float32)
            padded[:h, :w] = gray.astype(np.float32) / 255.0

            t = torch.from_numpy(padded).unsqueeze(0).unsqueeze(0)
            series_tensors.append(t.to(self.device))

        return series_tensors