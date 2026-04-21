"""
step2_rectification/image_enhancer.py
Handles illumination normalization and contrast enhancement.
"""
import cv2
import numpy as np

def normalize_illumination(img: np.ndarray, image_type: str) -> np.ndarray:
    """
    Applies CLAHE and Gamma correction.
    """
    # 1. Convert to LAB to process only Luminance channel (preserves color)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # 2. Auto-gamma for dark photos
    mean_l = np.mean(l)
    if mean_l < 100 and image_type == "photo":
        # Brighten: output = 255 * (input/255)^(gamma)
        gamma = 0.7
        invGamma = 1.0 / gamma
        table = np.array([((i / 255.0) ** invGamma) * 255
                         for i in np.arange(0, 256)]).astype("uint8")
        l = cv2.LUT(l, table)
        
    # 3. Apply CLAHE
    # Higher limit for photos which often have uneven lighting
    clip_limit = 3.0 if image_type == "photo" else 2.0
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8, 8))
    l = clahe.apply(l)
    
    # 4. Reconstruct BGR
    enhanced_lab = cv2.merge((l, a, b))
    enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
    return enhanced_bgr
