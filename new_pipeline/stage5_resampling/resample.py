# new_pipeline/stage5_resampling/resample.py

import numpy as np
from scipy.signal import resample


# Standard output: 500Hz, 10 seconds
TARGET_FS      = 500
TARGET_SAMPLES = 5000


def resample_signal(signal: np.ndarray,
                     target_length: int = TARGET_SAMPLES) -> np.ndarray:
    """
    Fourier-domain resampling.
    2nd + 3rd place: scipy.signal.resample >> linear interpolation.
    """
    if len(signal) == target_length:
        return signal
    return resample(signal, target_length).astype(np.float32)


def resample_all_leads(leads: dict,
                        target_length: int = TARGET_SAMPLES) -> dict:
    """
    Resample all leads to target length.
    """
    return {
        name: resample_signal(sig, target_length)
        for name, sig in leads.items()
    }