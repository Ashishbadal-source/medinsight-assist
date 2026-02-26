from scipy.signal import savgol_filter
import numpy as np

def pixel_to_signal(skel):
    h, w = skel.shape
    signal = []

    for x in range(w):
        ys = np.where(skel[:, x] > 0)[0]
        if len(ys) == 0:
            signal.append(0.0)
        else:
            signal.append(float(h - ys.mean()))

    return np.array(signal, dtype=np.float32)

sig = savgol_filter(sig, window_length=21, polyorder=3)