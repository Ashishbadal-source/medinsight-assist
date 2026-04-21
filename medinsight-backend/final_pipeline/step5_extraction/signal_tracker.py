"""
step5_extraction/signal_tracker.py
Column-wise Signal Tracking and Gap Handling (Steps 5.3 - 5.4)
"""
import numpy as np
import scipy.interpolate

def track_signal(binary: np.ndarray) -> np.ndarray:
    """
    Follows the signal from left to right using a sliding window.
    """
    h, w = binary.shape
    signal = np.zeros(w)
    
    # Step 1: Initialize
    # Find the first column with signal
    y_prev = h // 2 # Start at center
    found_first = False
    
    # Step 2: Main Tracking Loop
    delta = int(h * 0.15) # Search window ±15% of height
    
    for x in range(w):
        column = binary[:, x]
        
        # Define window
        y_min = max(0, y_prev - delta)
        y_max = min(h, y_prev + delta)
        window = column[y_min:y_max]
        
        # Step 3: Peak Detection
        indices = np.where(window > 0)[0]
        
        if len(indices) > 0:
            # Step 5.3: Gaussian-Weighted Center of Mass (Sub-pixel Accuracy)
            # Take the window of pixels around the median signal
            median_idx = int(np.median(indices))
            
            # Extract local patch around the signal line
            patch_size = 5
            p_min = max(0, median_idx - patch_size)
            p_max = min(len(window), median_idx + patch_size + 1)
            local_vals = window[p_min:p_max].astype(np.float32)
            local_idx = np.arange(p_min, p_max).astype(np.float32)
            
            # Calculate Weighted Centroid
            # Use local intensity as weight
            if np.sum(local_vals) > 0:
                y_refined = np.sum(local_idx * local_vals) / np.sum(local_vals) + y_min
            else:
                y_refined = median_idx + y_min
                
            signal[x] = float(y_refined)
            y_prev = int(y_refined)
            found_first = True
        else:
            # Step 5.4: Gap Handling (Mark for interpolation)
            signal[x] = np.nan
            
    # Step 5.4: Fill Gaps using Cubic Spline
    x_indices = np.arange(w)
    valid = ~np.isnan(signal)
    
    if np.any(valid):
        # Handle start/end edge cases
        if not valid[0]: signal[0] = h // 2; valid[0] = True
        if not valid[-1]: signal[-1] = h // 2; valid[-1] = True
        
        interp_func = scipy.interpolate.interp1d(x_indices[valid], signal[valid], 
                                               kind='linear', fill_value="extrapolate")
        final_signal = interp_func(x_indices)
    else:
        final_signal = np.full(w, h // 2) # Total failure fallback

    return final_signal
