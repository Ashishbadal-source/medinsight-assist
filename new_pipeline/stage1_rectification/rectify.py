# new_pipeline/stage1_rectification/rectify.py

import cv2
import numpy as np
from .detect_grid import detect_grid_intersections, remove_outliers_surface_fit


# Target output size (3rd place proven best)
TARGET_W = 4400
TARGET_H = 1700


def estimate_homography_lowres(img: np.ndarray, 
                                scale_factor: float = 0.25):
    """
    3rd place approach:
    - Estimate homography on LOW-RES image (fast)
    - Scale up for hi-res transform
    """
    h_orig, w_orig = img.shape[:2]
    
    # Downscale for fast processing
    small = cv2.resize(img, None, fx=scale_factor, fy=scale_factor,
                       interpolation=cv2.INTER_AREA)
    
    # Detect grid on small image
    points_small = detect_grid_intersections(small)
    
    if len(points_small) < 4:
        return None, None
    
    # Remove outliers
    points_small = remove_outliers_surface_fit(points_small)
    
    # Scale points back to original resolution
    points_orig = points_small / scale_factor
    
    return points_orig, (h_orig, w_orig)


def build_rectified_image(img: np.ndarray) -> np.ndarray:
    """
    Full hi-res rectification pipeline.
    Output: 4400 x 1700 rectified ECG image
    """
    h, w = img.shape[:2]
    
    # --- Step 1: Get grid points (estimated on low-res, scaled to hi-res) ---
    grid_points, orig_shape = estimate_homography_lowres(img, scale_factor=0.25)
    
    if grid_points is None or len(grid_points) < 4:
        # Fallback: just resize
        return cv2.resize(img, (TARGET_W, TARGET_H), 
                          interpolation=cv2.INTER_LANCZOS4)
    
    # --- Step 2: Define target grid corners ---
    # Standard ECG grid: approx 55 cols x 43 rows of small squares
    # Map to target canvas
    src_pts = grid_points[:4].astype(np.float32)
    
    # Sort: top-left, top-right, bottom-right, bottom-left
    src_pts = _sort_corners(src_pts)
    
    dst_pts = np.array([
        [0,        0       ],
        [TARGET_W, 0       ],
        [TARGET_W, TARGET_H],
        [0,        TARGET_H]
    ], dtype=np.float32)
    
    # --- Step 3: Compute homography ---
    H, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
    
    if H is None:
        return cv2.resize(img, (TARGET_W, TARGET_H),
                          interpolation=cv2.INTER_LANCZOS4)
    
    # --- Step 4: Warp at FULL resolution ---
    # LANCZOS4 = best quality (5th place confirmed)
    rectified = cv2.warpPerspective(
        img, H, (TARGET_W, TARGET_H),
        flags=cv2.INTER_LANCZOS4,
        borderMode=cv2.BORDER_REPLICATE
    )
    
    return rectified


def _sort_corners(pts: np.ndarray) -> np.ndarray:
    """Sort 4 points: TL, TR, BR, BL"""
    rect = np.zeros((4, 2), dtype=np.float32)
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]   # TL
    rect[2] = pts[np.argmax(s)]   # BR
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)] # TR
    rect[3] = pts[np.argmax(diff)] # BL
    return rect