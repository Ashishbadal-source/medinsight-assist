import cv2
import numpy as np

def check_exposure(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # percentage of very dark or very bright pixels
    dark_ratio = np.mean(gray < 30)
    bright_ratio = np.mean(gray > 245)

    if dark_ratio > 0.4:
        return True   # too dark
    if bright_ratio > 0.85:
        return True   # too washed out

    return False
