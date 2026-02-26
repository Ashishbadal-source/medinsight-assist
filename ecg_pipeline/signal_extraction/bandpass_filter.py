import numpy as np
from scipy.signal import butter, filtfilt

def bandpass_filter(signal, fs=500, low=0.5, high=40):
    b, a = butter(
        N=4,
        Wn=[low / (fs / 2), high / (fs / 2)],
        btype="band"
    )
    return filtfilt(b, a, signal)
