import cv2
import numpy as np

def extract_waveform_edges(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Moderate blur (not too strong)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # Conservative edge detection
    edges = cv2.Canny(blur, 50, 150)

    # -------- Attempt 1: moderate grid removal --------
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 25))
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 1))

    vertical_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, vertical_kernel)
    no_vertical = cv2.subtract(edges, vertical_lines)

    horizontal_lines = cv2.morphologyEx(no_vertical, cv2.MORPH_OPEN, horizontal_kernel)
    cleaned = cv2.subtract(no_vertical, horizontal_lines)

    # If waveform survives → good
    if cv2.countNonZero(cleaned) > 0:
        return cleaned

    # -------- Fallback: VERY IMPORTANT --------
    # If aggressive suppression killed waveform,
    # return raw edges instead of failing
    print("⚠️ Grid suppression too aggressive, falling back to raw edges")

    return edges
