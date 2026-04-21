"""
step5_extraction/isolator.py
Signal Isolation and Noise Cleaning (Steps 5.1 - 5.2)
"""
import cv2
import numpy as np

def isolate_signal(img: np.ndarray) -> np.ndarray:
    """
    Extracts black signal ink from various backgrounds.
    """
    if img.ndim == 3:
        # Step 5.1: Adaptive Color Isolation
        # Convert to LAB to isolate 'L' (Lightness)
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l_channel, a, b = cv2.split(lab)
        
        # Grid is usually light pink/red, signal is DARK.
        # Use a more sensitive threshold for L channel
        _, binary = cv2.threshold(l_channel, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # If signal is too sparse, relax the threshold
        if np.mean(binary) < 0.005 * 255:
            _, binary = cv2.threshold(l_channel, 200, 255, cv2.THRESH_BINARY_INV)
    else:
        # Grayscale Adaptive Threshold - More sensitive (C constant from 10 to 15)
        binary = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                     cv2.THRESH_BINARY_INV, 31, 15)

    # Step 5.2: Noise Cleaning (Signal-Preserving)
    # Only remove very small noise if the image is busy
    if np.mean(binary) > 0.1 * 255:
        kernel = np.ones((2, 2), np.uint8)
        binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
    
    # Close small gaps in the signal line (Horizontal bias for continuity)
    kernel_close = np.ones((1, 3), np.uint8) 
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel_close)
    
    return binary
