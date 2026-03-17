# new_pipeline/run_new_pipeline.py

import cv2
from stage0_orientation.correct_orientation import correct_orientation
from stage1_rectification.rectify import build_rectified_image

def run_stage0_stage1(image_path: str) -> dict:
    img = cv2.imread(image_path)
    
    # Stage 0
    img_oriented = correct_orientation(img)
    
    # Stage 1  
    img_rectified = build_rectified_image(img_oriented)
    
    return {
        "oriented": img_oriented,
        "rectified": img_rectified,  # 4400x1700
    }