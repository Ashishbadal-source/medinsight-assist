import numpy as np

def validate_ecg(ecg):
    """
    ecg: numpy array (12, 5000)
    returns: (bool, reason)
    """

    if ecg.shape != (12, 5000):
        return False, "Invalid shape"

    for i in range(12):
        sig = ecg[i]

        if np.all(sig == 0):
            return False, f"Lead {i} is flat"

        if np.ptp(sig) < 0.05:
            return False, f"Lead {i} amplitude too low"

        if np.isnan(sig).any() or np.isinf(sig).any():
            return False, f"Lead {i} contains NaN/Inf"

    return True, "OK"
