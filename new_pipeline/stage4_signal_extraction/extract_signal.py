# new_pipeline/stage4_signal_extraction/extract_signal.py

import numpy as np


def heatmap_to_signal(heatmap: np.ndarray) -> np.ndarray:
    """
    Sub-pixel signal extraction.
    5th place expectation + 3rd place parabolic refinement.
    Input:  heatmap (H, W) — raw model output
    Output: signal (W,) — pixel coordinates
    """
    H, W  = heatmap.shape
    y_idx = np.arange(H, dtype=np.float32)
    eps   = 1e-8

    # Softmax column-wise
    hm_exp = np.exp(heatmap - heatmap.max(axis=0, keepdims=True))
    prob   = hm_exp / (hm_exp.sum(axis=0, keepdims=True) + eps)

    # Expectation (5th place)
    y_exp = (prob * y_idx[:, None]).sum(axis=0)

    # Parabolic refinement (3rd place)
    y_int = np.argmax(prob, axis=0)
    y_ref = y_exp.copy()

    for x in range(W):
        yi = y_int[x]
        if 0 < yi < H - 1:
            yl = prob[yi-1, x]
            yc = prob[yi,   x]
            yr = prob[yi+1, x]
            d  = yl - 2*yc + yr
            if abs(d) > 1e-8:
                y_ref[x] = yi + (yl - yr) / (2 * d)

    return y_ref  # pixel coords (W,)


def pixel_to_mv(y_pixels: np.ndarray,
                height: int,
                mv_range: float = 3.0) -> np.ndarray:
    """
    Convert pixel coordinates to millivolts.
    Inverts the normalization done in signal_to_heatmap_fast.
    """
    sig_norm = 1.0 - (y_pixels - height * 0.1) / (height * 0.8)
    sig_norm = np.clip(sig_norm, 0, 1)
    return sig_norm * 2 * mv_range - mv_range


def extract_leads_from_heatmaps(heatmaps: list,
                                  crop_height: int = 212) -> dict:
    """
    Extract all 12 leads from 4 series heatmaps.

    heatmaps: list of 4 arrays, each (H, W)
    Series layout:
      Row 0: I, aVR, V1, V4   (4 segments of W/4 each)
      Row 1: II, aVL, V2, V5
      Row 2: III, aVF, V3, V6
      Row 3: Long Lead II (full width)

    Returns: dict {lead_name: signal_mv (N,)}
    """
    SERIES_LEADS = [
        ['I',   'aVR', 'V1', 'V4'],
        ['II',  'aVL', 'V2', 'V5'],
        ['III', 'aVF', 'V3', 'V6'],
    ]

    leads = {}

    for row in range(3):
        hm  = heatmaps[row]   # (H, W)
        H, W = hm.shape
        seg_w = W // 4

        for col, lead_name in enumerate(SERIES_LEADS[row]):
            seg_hm = hm[:, col*seg_w:(col+1)*seg_w]  # (H, seg_w)
            y_pix  = heatmap_to_signal(seg_hm)
            sig_mv = pixel_to_mv(y_pix, height=H)
            leads[lead_name] = sig_mv

    # Long Lead II (Row 3 — full width)
    hm_long = heatmaps[3]
    y_pix   = heatmap_to_signal(hm_long)
    leads['II_long'] = pixel_to_mv(y_pix, height=hm_long.shape[0])

    return leads