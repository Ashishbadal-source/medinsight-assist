# new_pipeline/stage1_rectification/detect_grid.py

import cv2
import numpy as np
from scipy import ndimage


def detect_grid_intersections(img: np.ndarray, 
                               grid_spacing_approx: int = 40) -> np.ndarray:
    """
    Detect ECG grid intersection points.
    Returns: array of (x, y) intersection coordinates
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    
    # --- Step 1: Enhance grid lines ---
    # Subtract signal (dark thin lines) keep grid
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    
    # Adaptive threshold to get grid
    grid_mask = cv2.adaptiveThreshold(
        blurred, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        blockSize=15, C=4
    )
    
    # --- Step 2: Separate H and V lines ---
    h_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (grid_spacing_approx, 1))
    v_kernel  = cv2.getStructuringElement(cv2.MORPH_RECT, (1, grid_spacing_approx))
    
    h_lines = cv2.morphologyEx(grid_mask, cv2.MORPH_OPEN, h_kernel)
    v_lines  = cv2.morphologyEx(grid_mask, cv2.MORPH_OPEN, v_kernel)
    
    # --- Step 3: Intersections = H AND V ---
    intersections = cv2.bitwise_and(h_lines, v_lines)
    
    # Dilate slightly to merge nearby pixels
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    intersections = cv2.dilate(intersections, kernel)
    
    # --- Step 4: Find centroids (weighted average for float precision) ---
    # 3rd place + 5th place technique: weighted avg not argmax
    labeled, num_features = ndimage.label(intersections)
    
    points = []
    for i in range(1, num_features + 1):
        component = (labeled == i)
        ys, xs = np.where(component)
        
        if len(xs) < 2:
            continue
        
        # Weighted centroid using intensity
        weights = gray[ys, xs].astype(np.float32)
        weights = np.max(weights) - weights + 1  # invert (dark = high weight)
        
        cx = np.average(xs, weights=weights)
        cy = np.average(ys, weights=weights)
        points.append([cx, cy])
    
    return np.array(points, dtype=np.float32)


def remove_outliers_surface_fit(points: np.ndarray, 
                                 threshold: float = 3.0) -> np.ndarray:
    """
    Surface fitting to remove outlier grid points.
    3rd place technique.
    """
    if len(points) < 10:
        return points
    
    xs, ys = points[:, 0], points[:, 1]
    
    # Fit polynomial surface
    # Simple approach: fit line to x vs y
    coeffs = np.polyfit(xs, ys, deg=2)
    y_pred = np.polyval(coeffs, xs)
    
    residuals = np.abs(ys - y_pred)
    std = np.std(residuals)
    
    # Keep inliers only
    mask = residuals < threshold * std
    return points[mask]