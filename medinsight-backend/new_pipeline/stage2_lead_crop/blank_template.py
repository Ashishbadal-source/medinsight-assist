# new_pipeline/stage2_lead_crop/blank_template.py

import cv2
import numpy as np


def generate_blank_ecg_template(width: int = 1100,
                                 height: int = 425) -> np.ndarray:
    """
    5th place technique:
    Blank ECG grid template — no signal, just grid lines.
    Concatenated with lead crop as 4th channel.
    Helps model learn grid layout faster.
    """
    template = np.ones((height, width), dtype=np.uint8) * 255

    # ECG standard: 1mm small grid, 5mm large grid
    # At our resolution: approx 8px small, 40px large
    small_grid_px = 8
    large_grid_px = 40

    # Draw small grid (light pink/gray)
    for x in range(0, width, small_grid_px):
        cv2.line(template, (x, 0), (x, height), 220, 1)
    for y in range(0, height, small_grid_px):
        cv2.line(template, (0, y), (width, y), 220, 1)

    # Draw large grid (darker)
    for x in range(0, width, large_grid_px):
        cv2.line(template, (x, 0), (x, height), 180, 1)
    for y in range(0, height, large_grid_px):
        cv2.line(template, (0, y), (width, y), 180, 1)

    return template


def concat_with_template(lead_crop_bgr: np.ndarray) -> np.ndarray:
    """
    Concatenate BGR lead crop with blank template.
    Input:  H x W x 3 (BGR)
    Output: H x W x 4 (BGR + template grayscale)
    """
    h, w = lead_crop_bgr.shape[:2]

    template = generate_blank_ecg_template(w, h)
    template = template[:, :, np.newaxis]  # H x W x 1

    # 4-channel: BGR + template
    four_channel = np.concatenate([lead_crop_bgr, template], axis=2)

    return four_channel


def prepare_lead_inputs(crops: dict) -> dict:
    """
    Apply blank template to all lead crops.
    Returns: {lead_name: 4-channel array}
    """
    inputs = {}
    for lead_name, crop in crops.items():
        inputs[lead_name] = concat_with_template(crop)
    return inputs