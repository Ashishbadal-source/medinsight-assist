import numpy as np

def is_incomplete(img):
    h, w, _ = img.shape
    if h < 500 or w < 500:
        return True
    return False
