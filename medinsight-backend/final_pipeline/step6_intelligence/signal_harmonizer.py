"""
step6_intelligence/signal_harmonizer.py
Signal Filtering and Alignment (Step 6.0)
"""
import numpy as np
import scipy.signal

def harmonize_signal(signal: np.ndarray, fs: int = 500) -> np.ndarray:
    """
    Applies diagnostic bandpass filtering (0.5 - 40 Hz).
    """
    # 1. Bandpass Filter (Butterworth)
    nyq = 0.5 * fs
    low = 0.5 / nyq
    high = 40.0 / nyq
    b, a = scipy.signal.butter(3, [low, high], btype='band')
    
    # Zero-phase filtering to avoid phase shift in peaks
    filtered = scipy.signal.filtfilt(b, a, signal)
    
    # 2. Baseline centering
    filtered = filtered - np.mean(filtered)
    
    return filtered

def normalize_amplitude(signals: dict) -> dict:
    """
    Ensures consistent scaling across leads.
    """
    norm_signals = {}
    for name, sig in signals.items():
        sig_np = np.array(sig)
        # Avoid division by zero for flatlines
        std = np.std(sig_np)
        if std > 1e-6:
            # We don't want to fully normalize (preserving relative lead strength is better)
            # but we remove extreme outliers
            norm_signals[name] = np.clip(sig_np, -5.0, 5.0).tolist()
        else:
            norm_signals[name] = sig_np.tolist()
    return norm_signals
