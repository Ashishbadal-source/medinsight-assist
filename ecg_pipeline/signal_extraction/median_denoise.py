# import numpy as np

# def normalize_amplitude(ecg, target_mv=1.0):
#     """
#     Normalize ECG amplitude lead-wise to target mV scale
#     ecg: (12, N)
#     """

#     ecg = ecg.astype(np.float32)
#     out = np.zeros_like(ecg)

#     for i in range(ecg.shape[0]):
#         sig = ecg[i]

#         peak = np.max(sig)
#         trough = np.min(sig)
#         p2p = peak - trough

#         if p2p < 1e-6:
#             out[i] = sig
#             continue

#         scale = target_mv / p2p
#         out[i] = sig * scale

#     return out

# # median_denoise = denoise_signal


import numpy as np
from scipy.signal import medfilt


def denoise_signal(signal, kernel_size=5):
    """
    Median filter based denoising
    signal: 1D numpy array
    """
    if len(signal) < kernel_size:
        return signal

    return medfilt(signal, kernel_size=kernel_size)
