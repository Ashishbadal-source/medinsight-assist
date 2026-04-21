"""
step3_calibration/grid_analyzer.py
Foundational Grid Spacing Detection (Step 3.1)
"""
import cv2
import numpy as np
import scipy.signal

def detect_grid_spacing(gray: np.ndarray) -> dict:
    """
    Detects the pixels-per-mm based on grid lines.
    Small Square = 1mm, Big Box = 5mm.
    """
    h, w = gray.shape
    
    # 1. Edge Detection (Preserve lines)
    edges = cv2.Canny(gray, 50, 150)
    
    # 2. Horizontal and Vertical Projections
    # Grid lines create periodic peaks in projections
    h_proj = np.mean(edges, axis=1)
    v_proj = np.mean(edges, axis=0)
    
    def get_spacing(proj, min_dist=5):
        # Smoothing to avoid double peaks
        proj = scipy.signal.savgol_filter(proj, 7, 2)
        peaks, _ = scipy.signal.find_peaks(proj, distance=min_dist, prominence=np.max(proj)*0.2)
        if len(peaks) < 2: return None
        spacings = np.diff(peaks)
        # We take the median to be robust against noise/labels
        return float(np.median(spacings))

    h_spacing = get_spacing(h_proj)
    v_spacing = get_spacing(v_proj)
    
    if h_spacing is None and v_spacing is None:
        return {"px_per_mm": None, "confidence": 0.0, "type": "none"}
    
    # Use average of both directions if available
    spacing = (h_spacing + v_spacing) / 2.0 if (h_spacing and v_spacing) else (h_spacing or v_spacing)
    
    # Heuristic: Is this a Small Square (1mm) or a Big Box (5mm)?
    # Standard ECGs are ~10-40 pixels per mm depending on resolution.
    # If spacing is > 50px, it's likely a 5mm Big Box.
    grid_type = "small"
    px_per_mm = spacing
    
    if spacing > 50: # Likely 5mm box
        grid_type = "big"
        px_per_mm = spacing / 5.0
        
    return {
        "px_per_mm": px_per_mm,
        "grid_type": grid_type,
        "raw_spacing": spacing,
        "confidence": 0.9 if h_spacing and v_spacing else 0.5
    }
