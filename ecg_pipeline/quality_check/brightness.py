import cv2
import numpy as np

def bad_brightness(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mean = np.mean(gray)
    if mean < 40 or mean > 220:
        return True
    return False
