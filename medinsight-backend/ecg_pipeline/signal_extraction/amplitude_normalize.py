import numpy as np

def normalize_amplitude(ecg, target_mv=1.0):
    """
    Lead-wise amplitude normalization.

    Parameters
    ----------
    ecg : np.ndarray
        Shape (N, L) or (1, L)
        Single lead or multi-lead ECG.
    target_mv : float
        Desired peak-to-peak scale (approx mV).

    Returns
    -------
    np.ndarray
        Same shape as input, amplitude normalized.
    """

    ecg = ecg.astype(np.float32)
    out = np.zeros_like(ecg)

    # handle single-lead or multi-lead uniformly
    for i in range(ecg.shape[0]):
        sig = ecg[i]

        peak = np.max(sig)
        trough = np.min(sig)
        ptp = peak - trough

        # safety: avoid division by zero
        if ptp < 1e-6:
            out[i] = sig
            continue

        scale = target_mv / ptp
        out[i] = sig * scale

    return out
