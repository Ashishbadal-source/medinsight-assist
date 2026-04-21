"""
step4_segmentation/layout_engine.py
Identifies the ECG grid family (Step 4.1)
"""
import numpy as np
import scipy.signal

def detect_layout_family(gray: np.ndarray) -> dict:
    """
    Detects if the layout is 3x4, 6x2, or 12x1.
    """
    h, w = gray.shape
    
    # 1. Horizontal Projection (Row Profile)
    # Sum along rows to find where leads are active
    row_profile = np.sum(255 - gray, axis=1) # Invert so signal is high
    
    # Smooth to find major bands
    row_profile = scipy.signal.savgol_filter(row_profile, int(h*0.05)|1, 2)
    
    # Detect peaks representing lead rows
    peaks, _ = scipy.signal.find_peaks(row_profile, distance=h//15, prominence=np.max(row_profile)*0.15)
    band_count = len(peaks)
    
    # Check for Rhythm Strip (Long strip at the bottom)
    # Rhythm strips are usually separated by a larger gap or are just one long band
    has_rhythm = False
    if band_count > 1:
        # If the last gap is larger or the last peak is very broad
        last_gap = peaks[-1] - (peaks[-2] if len(peaks)>1 else 0)
        if last_gap > h // 4: # Heuristic for bottom rhythm lead
            has_rhythm = True

    layout = "unknown"
    if band_count == 3 or band_count == 4: # 3x4 or 3x4 + 1
        layout = "3x4_plus_1" if has_rhythm or band_count == 4 else "3x4"
    elif band_count == 6 or band_count == 7:
        layout = "6x2"
    elif band_count >= 12:
        layout = "12x1"
        
    return {
        "layout_type": layout,
        "band_count": band_count,
        "has_rhythm": has_rhythm,
        "row_peaks": peaks.tolist(),
        "confidence": 0.9 if layout != "unknown" else 0.3
    }
