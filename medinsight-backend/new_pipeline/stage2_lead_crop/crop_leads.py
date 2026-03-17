# new_pipeline/stage2_lead_crop/crop_leads.py

import cv2
import numpy as np
from scipy.interpolate import RectBivariateSpline

# Standard 12-lead ECG layout
# Row 0: I,   aVR, V1, V4
# Row 1: II,  aVL, V2, V5
# Row 2: III, aVF, V3, V6
# Row 3: Long Lead II (full width)

LEAD_LAYOUT = {
    "I":      (0, 0), "aVR": (0, 1), "V1": (0, 2), "V4": (0, 3),
    "II":     (1, 0), "aVL": (1, 1), "V2": (1, 2), "V5": (1, 3),
    "III":    (2, 0), "aVF": (2, 1), "V3": (2, 2), "V6": (2, 3),
    "II_long": (3, 0),
}

LEAD_ORDER = ["I", "II", "III", "aVR", "aVL", "aVF",
              "V1", "V2", "V3", "V4", "V5", "V6", "II_long"]

# Target output size per lead crop
CROP_W = 1100  # 4400 / 4
CROP_H = 425   # signal area height / 3 rows


def get_lead_boundaries(img_h: int, img_w: int,
                         header_ratio: float = 0.12):
    """
    Calculate pixel boundaries for each lead region.
    header_ratio: top portion to skip (patient info)
    """
    # Skip header
    signal_start_y = int(img_h * header_ratio)
    signal_h = img_h - signal_start_y

    # 3 short lead rows + 1 long strip
    row_h = signal_h // 4
    col_w = img_w // 4

    boundaries = {}

    for lead_name, (row, col) in LEAD_LAYOUT.items():
        if lead_name == "II_long":
            # Full width bottom strip
            x1 = 0
            x2 = img_w
            y1 = signal_start_y + 3 * row_h
            y2 = img_h
        else:
            x1 = col * col_w
            x2 = x1 + col_w
            y1 = signal_start_y + row * row_h
            y2 = y1 + row_h

        boundaries[lead_name] = (x1, y1, x2, y2)

    return boundaries


def piecewise_homography_crop(img: np.ndarray,
                               grid_points: np.ndarray,
                               lead_name: str,
                               boundaries: dict,
                               K: int = 16) -> np.ndarray:
    """
    5th place technique:
    K=16 nearby keypoints se local piecewise homography.
    Better than single global homography for distorted images.
    """
    x1, y1, x2, y2 = boundaries[lead_name]

    # Center of this lead region
    cx = (x1 + x2) / 2
    cy = (y1 + y2) / 2

    # Find K nearest grid points to this lead center
    if grid_points is not None and len(grid_points) >= K:
        dists = np.sqrt((grid_points[:, 0] - cx)**2 +
                        (grid_points[:, 1] - cy)**2)
        nearest_idx = np.argsort(dists)[:K]
        local_pts = grid_points[nearest_idx]

        # Source points (in rectified image space)
        src_pts = local_pts.astype(np.float32)

        # Destination points (normalized target space)
        # Map local grid points to where they should be in crop
        dst_pts = _normalize_to_crop(src_pts, x1, y1, x2, y2,
                                      CROP_W, CROP_H)

        if len(src_pts) >= 4:
            H, mask = cv2.findHomography(src_pts, dst_pts,
                                          cv2.RANSAC, 5.0)
            if H is not None:
                crop = cv2.warpPerspective(
                    img, H, (CROP_W, CROP_H),
                    flags=cv2.INTER_LANCZOS4,
                    borderMode=cv2.BORDER_REPLICATE
                )
                return crop

    # Fallback: simple crop + resize
    region = img[y1:y2, x1:x2]
    if region.size == 0:
        return np.ones((CROP_H, CROP_W, 3), dtype=np.uint8) * 255

    return cv2.resize(region, (CROP_W, CROP_H),
                      interpolation=cv2.INTER_LANCZOS4)


def _normalize_to_crop(pts: np.ndarray,
                        x1: int, y1: int,
                        x2: int, y2: int,
                        target_w: int, target_h: int) -> np.ndarray:
    """
    Map source points to destination crop coordinates.
    """
    dst = pts.copy()
    dst[:, 0] = (pts[:, 0] - x1) / (x2 - x1) * target_w
    dst[:, 1] = (pts[:, 1] - y1) / (y2 - y1) * target_h
    return dst.astype(np.float32)


def crop_all_leads(img: np.ndarray,
                   grid_points: np.ndarray = None) -> dict:
    """
    Main function — crop all 13 leads from rectified image.
    Returns dict: {lead_name: crop_image}
    """
    h, w = img.shape[:2]
    boundaries = get_lead_boundaries(h, w)

    crops = {}
    for lead_name in LEAD_ORDER:
        crop = piecewise_homography_crop(
            img, grid_points, lead_name, boundaries, K=16
        )
        crops[lead_name] = crop

    return crops