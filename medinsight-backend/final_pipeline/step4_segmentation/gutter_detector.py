"""
step4_segmentation/gutter_detector.py
Finds Row and Column Separators (Step 4.2 - 4.3)
"""
import numpy as np
import scipy.signal

def find_gutters(gray: np.ndarray, orientation='h', expected_count=3) -> list:
    """
    Finds valleys in projection to determine separators.
    orientation: 'h' for rows, 'v' for columns
    """
    # Invert image (signal = high)
    data = 255.0 - gray.astype(np.float32)
    
    if orientation == 'h':
        # Rows: Sum across width
        profile = np.sum(data, axis=1)
        length = gray.shape[0]
        smooth_win = int(length * 0.05) | 1
    else:
        # Columns: Variance across height is better for finding separators
        profile = np.var(data, axis=0)
        length = gray.shape[1]
        smooth_win = int(length * 0.03) | 1
        
    # Smoothing
    profile = scipy.signal.savgol_filter(profile, smooth_win, 2)
    
    # Valleys are peaks of the INVERTED profile
    inverted_profile = np.max(profile) - profile
    
    # Heuristic: Min distance between separators
    # For a 3x4 layout, columns are ~25% of width
    min_dist = length // (expected_count + 1)
    
    peaks, _ = scipy.signal.find_peaks(inverted_profile, distance=min_dist, prominence=np.max(inverted_profile)*0.05)
    
    # Refine boundaries
    boundaries = [0] + sorted(peaks.tolist()) + [length]
    
    # --- Symmetry-Constraint Solver ---
    if len(boundaries) != expected_count + 1:
        if orientation == 'v':
            # Vertical columns are always symmetric in 3x4
            step = length / expected_count
            boundaries = [int(i * step) for i in range(expected_count + 1)]
        else:
            # Horizontal rows: Main leads are symmetric, Rhythm is separate
            # Use clinical geometry to predict boundaries if valleys are missing
            if expected_count > 3:
                # If rhythm present, top 80% is leads, bottom 20% is rhythm
                main_h = length * 0.8
                step = main_h / 3.0
                boundaries = [int(i * step) for i in range(4)] + [length]
            else:
                step = length / expected_count
                boundaries = [int(i * step) for i in range(expected_count + 1)]

    return boundaries

def get_3x4_grid(gray: np.ndarray, has_rhythm=True) -> tuple:
    """
    Specifically optimized for 3x4 layout.
    """
    h, w = gray.shape
    
    # 1. Row Separators
    # We expect 3 main rows + maybe 1 rhythm strip
    rows = find_gutters(gray, 'h', expected_count=4 if has_rhythm else 3)
    
    # 2. Column Separators
    # We expect 4 columns for 3x4
    cols = find_gutters(gray, 'v', expected_count=4)
    
    return rows, cols
