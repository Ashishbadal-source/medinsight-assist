# new_pipeline/run_new_pipeline.py

import cv2
from new_pipeline.stage0_orientation.correct_orientation import correct_orientation
from new_pipeline.stage1_rectification.rectify import build_rectified_image
from new_pipeline.stage1_rectification.detect_grid import detect_grid_intersections
from new_pipeline.stage2_lead_crop.crop_leads import crop_all_leads
from new_pipeline.stage2_lead_crop.blank_template import prepare_lead_inputs


def run_stages_0_to_2(image_path: str) -> dict:
    """
    Stage 0 → Stage 1 → Stage 2
    Input:  raw ECG image path
    Output: 13 lead crops (4-channel each), ready for Stage 3
    """
    # Stage 0 — Orientation
    img = cv2.imread(image_path)
    img = correct_orientation(img)

    # Stage 1 — Rectification → 4400x1700
    img_rectified = build_rectified_image(img)

    # Grid points for Stage 2
    grid_points = detect_grid_intersections(img_rectified)

    # Stage 2 — Lead Cropping + Blank Template
    crops = crop_all_leads(img_rectified, grid_points)
    lead_inputs = prepare_lead_inputs(crops)  # 4-channel

    return {
        "rectified": img_rectified,      # 4400x1700
        "grid_points": grid_points,
        "lead_inputs": lead_inputs,       # 13 x (425, 1100, 4)
    }