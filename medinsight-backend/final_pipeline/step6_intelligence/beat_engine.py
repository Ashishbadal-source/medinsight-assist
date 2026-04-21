"""
step6_intelligence/beat_engine.py
QRS Detection via Pan-Tompkins Algorithm (Step 6.1)
"""
import numpy as np
import scipy.signal

def detect_r_peaks(signal: np.ndarray, fs: int = 500) -> list:
    """
    Robust QRS Detection using Pan-Tompkins hybrid method.
    """
    # 1. Bandpass (5-15 Hz)
    nyq = 0.5 * fs
    low, high = 5.0 / nyq, 15.0 / nyq
    b, a = scipy.signal.butter(3, [low, high], btype='band')
    filtered = scipy.signal.filtfilt(b, a, signal)
    
    # 2. Derivative
    # (High frequency component of QRS)
    diff = np.diff(filtered)
    
    # 3. Squaring
    # (Magnify sharp peaks, suppress lower waves)
    squared = diff ** 2
    
    # 4. Moving Window Integration (approx 150ms)
    window_len = int(0.150 * fs)
    integrated = np.convolve(squared, np.ones(window_len)/window_len, mode='same')
    
    # 5. Adaptive Thresholding
    # Lowered from 1.5 to 0.8 for higher sensitivity to clean scans
    threshold = np.mean(integrated) + 0.8 * np.std(integrated)
    peaks, _ = scipy.signal.find_peaks(integrated, height=threshold, distance=int(0.3 * fs))
    
    # Refine R-peak location on original signal (look for local max in window)
    refined_peaks = []
    win = int(0.05 * fs)
    for p in peaks:
        search_min = max(0, p - win)
        search_max = min(len(signal), p + win)
        # Look for max amplitude in original signal
        r_peak = search_min + np.argmax(np.abs(signal[search_min:search_max]))
        refined_peaks.append(int(r_peak))
        
    return sorted(list(set(refined_peaks)))
