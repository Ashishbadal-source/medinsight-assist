# new_pipeline/run_new_pipeline.py

import cv2
import numpy as np
import torch

from new_pipeline.stage0_orientation.correct_orientation import correct_orientation
from new_pipeline.stage1_rectification.rectify import build_rectified_image
from new_pipeline.stage1_rectification.detect_grid import detect_grid_intersections
from new_pipeline.stage2_lead_crop.crop_leads import crop_all_leads
from new_pipeline.stage2_lead_crop.blank_template import prepare_lead_inputs
from new_pipeline.stage4_signal_extraction.extract_signal import extract_leads_from_heatmaps
from new_pipeline.stage5_resampling.resample import resample_all_leads
from new_pipeline.stage6_postprocessing.postprocess import postprocess_leads, leads_to_array


def run_new_pipeline(image_path: str,
                      model,
                      device: str = 'cpu') -> np.ndarray:
    """
    Full pipeline: raw ECG image → 12-lead signal array
    Input:  image path
    Output: (12, 5000) numpy array — 500Hz, 10 seconds
    """

    # ── Stage 0: Orientation ──────────────────────────────────────────────────
    img = cv2.imread(image_path)
    img = correct_orientation(img)

    # ── Stage 1: Rectification → 4400x1700 ───────────────────────────────────
    img_rect     = build_rectified_image(img)
    grid_points  = detect_grid_intersections(img_rect)

    # ── Stage 2: Lead Crops + Template ───────────────────────────────────────
    crops       = crop_all_leads(img_rect, grid_points)
    lead_inputs = prepare_lead_inputs(crops)  # {name: (H,W,4)}

    # ── Stage 3: Model Inference ──────────────────────────────────────────────
    # Prepare 4 series tensors
    from new_pipeline.stage2_lead_crop.crop_leads import LEAD_ORDER
    series_list = _prepare_series_tensors(lead_inputs, device)

    model.eval()
    with torch.no_grad():
        heatmap_preds = model(series_list)  # 4 x (1, 1, H, W)

    # ── Stage 4: Signal Extraction ────────────────────────────────────────────
    heatmaps = [heatmap_preds[i][0, 0].cpu().numpy()
                for i in range(4)]
    leads = extract_leads_from_heatmaps(heatmaps)

    # ── Stage 5: Resampling ───────────────────────────────────────────────────
    leads = resample_all_leads(leads, target_length=5000)

    # ── Stage 6: Post-processing ──────────────────────────────────────────────
    leads = postprocess_leads(leads)

    # ── Final: (12, 5000) array ───────────────────────────────────────────────
    ecg_array = leads_to_array(leads)

    return ecg_array  # (12, 5000)


def _prepare_series_tensors(lead_inputs: dict,
                              device: str) -> list:
    """
    Convert lead crops to 4 series tensors for model input.
    Each series: (1, 4, H, W)
    """
    import torch
    from torchvision.transforms.functional import to_tensor

    SERIES_LAYOUT = [
        ['I',   'aVR', 'V1',  'V4'],
        ['II',  'aVL', 'V2',  'V5'],
        ['III', 'aVF', 'V3',  'V6'],
        ['II_long'],
    ]

    series_tensors = []

    for row_leads in SERIES_LAYOUT:
        if len(row_leads) == 1:
            # Long Lead II — full width
            crop = lead_inputs[row_leads[0]]  # (H, W, 4)
        else:
            # Concatenate 4 lead crops horizontally
            crops = [lead_inputs[n] for n in row_leads]
            crop  = np.concatenate(crops, axis=1)  # (H, 4W, 4)

        # To tensor (4, H, W)
        t = torch.from_numpy(
            crop.transpose(2, 0, 1)
        ).float().unsqueeze(0) / 255.0  # (1, 4, H, W)

        series_tensors.append(t.to(device))

    return series_tensors