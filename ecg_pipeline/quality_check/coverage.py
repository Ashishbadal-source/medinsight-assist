import cv2
import numpy as np

def check_coverage(image, min_ratio=0.02):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # detect ink / grid / waveform pixels
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

    filled_ratio = np.sum(thresh > 0) / thresh.size

    if filled_ratio < min_ratio:
        return True   # ECG too small / cropped

    return False
