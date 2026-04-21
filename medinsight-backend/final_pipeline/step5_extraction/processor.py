"""
step5_extraction/processor.py
Baseline Correction, Scaling, and Resampling (Steps 5.5 - 5.8)
"""
import numpy as np
import scipy.signal
from .isolator import isolate_signal
from .signal_tracker import track_signal

class ECGProcessor:
    def __init__(self, target_fs=500):
        self.target_fs = target_fs

    def process_lead(self, lead_img: np.ndarray, calib: dict) -> np.ndarray:
        """
        Processes a single lead crop into a digital signal.
        """
        # 5.1 & 5.2: Isolation
        binary = isolate_signal(lead_img)
        
        # 5.3 & 5.4: Tracking
        raw_pixels = track_signal(binary)
        
        # 5.5: Baseline Drift Correction
        # Estimate baseline using a large median filter (approx 1.5s)
        px_per_mm = calib["pixels_per_mm"]
        # 1.5 seconds = 37.5mm = 37.5 * px_per_mm pixels
        win_size = int(37.5 * px_per_mm) | 1
        baseline = scipy.signal.medfilt(raw_pixels, win_size)
        
        # Subtract drift
        clean_pixels = raw_pixels - baseline
        
        # 5.6: Pixel -> mV Conversion
        # Important: Pixels grow DOWNWARD, Voltage grows UPWARD. Invert.
        signal_mv = -clean_pixels / calib["pixels_per_mV"]
        
        # 5.7: Resampling to 500Hz
        # Current length in seconds = pixels / (px_per_mm * 25)
        duration = len(raw_pixels) / (px_per_mm * 25.0)
        target_len = int(duration * self.target_fs)
        
        if target_len > 10:
            resampled = scipy.signal.resample(signal_mv, target_len)
        else:
            resampled = signal_mv # Too short to resample reliably
            
        return resampled.tolist()

    def score_quality(self, signal: list) -> float:
        """
        Step 5.8: Simple Signal Quality Index
        """
        if not signal: return 0.0
        sig_np = np.array(signal)
        # Check for zero variance (flatline) or extreme noise
        std = np.std(sig_np)
        if std < 0.01: return 0.1 # Flatline
        
        # Check for sharp jumps (non-physiological)
        diffs = np.abs(np.diff(sig_np))
        if np.max(diffs) > 2.0: return 0.4 # Potential tracking jump
        
        return 0.9
