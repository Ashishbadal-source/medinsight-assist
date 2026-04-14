# new_pipeline/stage0_orientation/correct_orientation.py

import cv2
import numpy as np

def detect_orientation(img: np.ndarray) -> int:
    """
    Detect ECG image rotation.
    Returns: 0, 90, 180, or 270 degrees
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Binarize
    _, binary = cv2.threshold(gray, 0, 255, 
                               cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Horizontal vs vertical line energy
    h, w = binary.shape
    
    # Check horizontal line dominance (normal ECG = horizontal lines dominant)
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
    vertical_kernel   = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))
    
    h_lines = cv2.morphologyEx(binary, cv2.MORPH_OPEN, horizontal_kernel)
    v_lines = cv2.morphologyEx(binary, cv2.MORPH_OPEN, vertical_kernel)
    
    h_energy = np.sum(h_lines)
    v_energy = np.sum(v_lines)
    
    # Hough lines for angle
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLines(edges, 1, np.pi/180, threshold=100)
    
    if lines is None:
        return 0
    
    angles = []
    for line in lines[:50]:
        rho, theta = line[0]
        angle_deg = np.degrees(theta)
        angles.append(angle_deg)
    
    mean_angle = np.mean(angles)
    
    # Classify rotation
    if 80 <= mean_angle <= 100:
        return 0    # Normal
    elif mean_angle < 20 or mean_angle > 160:
        return 90   # Rotated 90
    elif 170 <= mean_angle <= 180 or 0 <= mean_angle <= 10:
        return 180  # Upside down
    else:
        return 270  # Rotated 270


def correct_orientation(img: np.ndarray) -> np.ndarray:
    """
    Auto-correct ECG image to upright orientation.
    """
    angle = detect_orientation(img)
    
    if angle == 0:
        return img
    
    # cv2.rotate codes
    rotate_map = {
        90:  cv2.ROTATE_90_COUNTERCLOCKWISE,
        180: cv2.ROTATE_180,
        270: cv2.ROTATE_90_CLOCKWISE
    }
    
    return cv2.rotate(img, rotate_map[angle])