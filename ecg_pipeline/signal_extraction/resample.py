import numpy as np
from scipy.signal import resample

def resample_signal(signal, target_len):
    return resample(signal, target_len)
