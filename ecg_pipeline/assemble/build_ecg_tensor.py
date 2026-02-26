import numpy as np

def build_ecg_tensor(signals):
    ecg = np.stack(signals)
    return ecg
