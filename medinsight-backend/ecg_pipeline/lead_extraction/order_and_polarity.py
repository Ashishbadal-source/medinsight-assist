import numpy as np

LEAD_NAMES = [
    "I", "II", "III",
    "aVR", "aVL", "aVF",
    "V1", "V2", "V3", "V4", "V5", "V6"
]

def fix_polarity(signal):
    """
    Ensure ECG signal has positive R-peak
    """
    if np.max(signal) < abs(np.min(signal)):
        signal = -signal
    return signal


def order_and_fix_ecg(ecg):
    """
    Input: ecg (12, N) unordered
    Output: ecg_ordered (12, N) ordered & polarity-fixed
    """

    num_leads = ecg.shape[0]
    assert num_leads == 12, "Expected 12 leads"

    # -------------------------------
    # STEP 1: Polarity correction
    # -------------------------------
    fixed = []
    for i in range(num_leads):
        sig = ecg[i]
        sig = fix_polarity(sig)
        fixed.append(sig)

    fixed = np.array(fixed)

    # -------------------------------
    # STEP 2: Order leads
    # Assumption (current crop_leads):
    # Row 0: I, aVR, V1, V4
    # Row 1: II, aVL, V2, V5
    # Row 2: III, aVF, V3, V6
    # -------------------------------
    order_idx = [
        0,  # I
        4,  # II
        8,  # III
        1,  # aVR
        5,  # aVL
        9,  # aVF
        2,  # V1
        6,  # V2
        10, # V3
        3,  # V4
        7,  # V5
        11  # V6
    ]

    ecg_ordered = fixed[order_idx]

    return ecg_ordered
