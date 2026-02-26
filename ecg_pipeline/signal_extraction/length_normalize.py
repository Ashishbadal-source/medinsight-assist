import numpy as np

def normalize_length(ecg, target_len=5000):
    """
    ecg: numpy array (12, N)
    returns: numpy array (12, target_len)
    """

    num_leads, curr_len = ecg.shape
    out = np.zeros((num_leads, target_len), dtype=np.float32)

    if curr_len == target_len:
        return ecg.astype(np.float32)

    if curr_len > target_len:
        # center crop
        start = (curr_len - target_len) // 2
        end = start + target_len
        out = ecg[:, start:end]

    else:
        # center pad
        pad = target_len - curr_len
        left = pad // 2
        right = pad - left
        out[:, left:left+curr_len] = ecg

    return out
