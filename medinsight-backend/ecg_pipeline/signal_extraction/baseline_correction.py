import numpy as np
from scipy.signal import butter, filtfilt

def remove_baseline(signal, fs=500, cutoff=0.5):
    """
    Remove baseline wander using high-pass Butterworth filter.
    """
    b, a = butter(
        N=2,
        Wn=cutoff / (fs / 2),
        btype="high"
    )
    return filtfilt(b, a, signal)
