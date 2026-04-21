"""
step3_calibration/pulse_engine.py
Calibration Pulse Detection (Step 3.2)
"""
import cv2
import numpy as np

def detect_calibration_pulse(gray: np.ndarray) -> dict:
    """
    Finds the 1mV calibration pulse in the left 20% of the image.
    Standard: 10mm height, 5mm width.
    """
    h, w = gray.shape
    roi_w = int(w * 0.22) # Search left 22%
    roi = gray[:, :roi_w]
    
    # 1. Binary threshold to isolate pulse
    _, binary = cv2.threshold(roi, 180, 255, cv2.THRESH_BINARY_INV)
    
    # 2. Find contours that match "Box" geometry
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    best_pulse = None
    max_score = -1
    
    for cnt in contours:
        x, y, cw, ch = cv2.boundingRect(cnt)
        
        # Heuristics for 1mV pulse:
        # - Height should be approx 2x Width (10mm vs 5mm)
        # - Area should be roughly rectangular
        aspect = ch / float(cw + 1e-6)
        area_ratio = cv2.contourArea(cnt) / (cw * ch + 1e-6)
        
        # Valid pulse aspect ratio range (allow for noise/skew)
        if 1.5 < aspect < 3.5 and area_ratio > 0.4:
            # Score based on "rectangleness" and verticality
            score = area_ratio * (1.0 - abs(aspect - 2.0) / 4.0)
            if score > max_score:
                max_score = score
                best_pulse = {"y_base": y + ch, "height": ch, "width": cw, "x": x, "y": y}
                
    if best_pulse and max_score > 0.4:
        return {
            "found": True,
            "height_px": best_pulse["height"],
            "base_y": best_pulse["y_base"],
            "rect": best_pulse,
            "confidence": float(max_score)
        }
    
    return {"found": False, "confidence": 0.0}
