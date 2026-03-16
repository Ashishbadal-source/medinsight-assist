import numpy as np
import cv2


def pixel_to_signal(mask, scale=0.01, target_len=5000):
    """
    Convert segmented ECG lead mask into 1D signal
    """

    h, w = mask.shape

    # ===============================
    # STEP 1: Resize width to target
    # ===============================
    resized = cv2.resize(
        mask,
        (target_len, h),
        interpolation=cv2.INTER_NEAREST
    )

    signal = np.zeros(target_len, dtype=np.float32)

    # ===============================
    # STEP 2: Column-wise extraction
    # ===============================
    for x in range(target_len):
        ys = np.where(resized[:, x] > 0)[0]

        # SAFETY: ignore empty / weak columns
        if len(ys) < 3:
            signal[x] = np.nan
            continue

        # ===============================
        # STEP 3: Robust centerline
        # ===============================
        # y_top = np.min(ys)
        # y_bottom = np.max(ys)

        # y_center = (y_top + y_bottom) / 2.0
        y = int(np.median(ys))
        # ===============================
        # STEP 4: Convert to amplitude
        # ===============================
        signal[x] = (h - y) * scale

    # ===============================
    # STEP 5: Handle missing values
    # ===============================
    valid_idx = np.where(~np.isnan(signal))[0]

    if len(valid_idx) > 10:
        signal = np.interp(
            np.arange(target_len),
            valid_idx,
            signal[valid_idx]
        )
    else:
        # extreme failure case
        signal[:] = 0.0

    return signal
