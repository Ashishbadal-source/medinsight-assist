import cv2
import numpy as np

def check_blur(image, threshold=100.0):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

    if laplacian_var < threshold:
        return True   # image is blurry
    return False

# alias for compatibility
is_blurry = check_blur