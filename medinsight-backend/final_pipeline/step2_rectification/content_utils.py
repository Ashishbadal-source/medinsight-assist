"""
step2_rectification/content_utils.py
Handles Calibration Pulse detection and Smart Cropping.
"""
import cv2
import numpy as np

def detect_calibration_pulse(gray: np.ndarray) -> dict:
    """
    Detects the 1mV calibration pulse (reference box) usually at the left edge.
    """
    h, w = gray.shape[:2]
    # Look at the leftmost 10%
    roi_w = int(w * 0.10)
    roi = gray[:, :roi_w]
    
    _, binary = cv2.threshold(roi, 127, 255, cv2.THRESH_BINARY_INV)
    
    # Find rectangular contours in the ROI
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    found = False
    pulse_height = None
    pulse_x_range = (0, 0)
    
    for cnt in contours:
        x, y, cw, ch = cv2.boundingRect(cnt)
        aspect = ch / float(cw + 1e-6)
        
        # Calibration pulses are typically vertical rectangular boxes (aspect ~2-3)
        # and should have a reasonable height relative to the image
        if 1.5 < aspect < 5.0 and ch > (h * 0.05):
            found = True
            pulse_height = ch
            pulse_x_range = (x, x + cw)
            break
            
    return {
        "found": found,
        "height_px": pulse_height,
        "x_range": pulse_x_range
    }

def smart_crop(img: np.ndarray, gray: np.ndarray, pulse_info: dict) -> np.ndarray:
    """
    Crops to the content of the ECG, protecting the calibration pulse.
    """
    h, w = gray.shape[:2]
    
    # Adaptive threshold to handle paper variations
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                 cv2.THRESH_BINARY_INV, 51, 10)
    
    # Morphological closing to join parts of the grid
    kernel = np.ones((5, 5), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    
    # Find bounding box of all content
    coords = cv2.findNonZero(binary)
    if coords is None:
        return img
        
    x, y, cw, ch = cv2.boundingRect(coords)
    
    # Apply Calibration Pulse Guard
    if pulse_info["found"]:
        # Ensure we don't crop past the left edge of the pulse
        x = min(x, max(0, pulse_info["x_range"][0] - 10))
        
    # Add conservative margin (2% or 20px)
    margin = max(int(min(h, w) * 0.02), 20)
    
    x1 = max(0, x - margin)
    y1 = max(0, y - margin)
    x2 = min(w, x + cw + margin)
    y2 = min(h, y + ch + margin)
    
    return img[y1:y2, x1:x2]
