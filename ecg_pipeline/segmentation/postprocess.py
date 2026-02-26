import cv2
import numpy as np

def clean_segmentation_mask(mask):
    """
    Remove grid/background from segmentation mask
    """
    mask = (mask > 0).astype("uint8") * 255

    # Remove thick structures (grid)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    opened = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=2)

    # Keep thin lines only
    cleaned = cv2.morphologyEx(opened, cv2.MORPH_ERODE, kernel, iterations=1)

    return cleaned
