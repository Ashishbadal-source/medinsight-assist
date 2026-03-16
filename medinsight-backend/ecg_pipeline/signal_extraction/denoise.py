import numpy as np
from scipy.signal import medfilt

def median_denoise(signal, kernel_size=5):
    """
    Remove sharp vertical spikes (grid remnants).
    """
    return medfilt(signal, kernel_size=kernel_size)
