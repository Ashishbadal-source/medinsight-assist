"""
final_pipeline/step2_rectification/test_rectifier.py
Comprehensive tests for Step 2 Rectification Engine.
"""
import os
import cv2
import numpy as np
import sys
from pathlib import Path

# Add project root to path
ROOT = str(Path(__file__).parent.parent.parent)
sys.path.insert(0, ROOT)

from final_pipeline.step2_rectification import ECGRectifier

def create_test_ecg(skew=0, perspective=False):
    """Creates a synthetic ECG image for testing."""
    img = np.full((1200, 2000, 3), 255, dtype=np.uint8)
    
    # Draw a grid
    for y in range(0, 1200, 20):
        cv2.line(img, (0, y), (2000, y), (200, 200, 255), 1)
    for x in range(0, 2000, 20):
        cv2.line(img, (x, 0), (x, 1200), (200, 200, 255), 1)
        
    # Draw some "waveforms"
    for row in [200, 500, 800]:
        pts = []
        for x in range(50, 1950, 5):
            y = row + int(50 * np.sin(x * 0.1))
            if x % 100 == 0: y -= 100 # QRS spike
            pts.append([x, y])
        cv2.polylines(img, [np.array(pts, np.int32)], False, (0, 0, 0), 2)
        
    # Draw a calibration pulse
    cv2.rectangle(img, (20, 450), (40, 550), (0, 0, 0), 2)
    
    # Apply skew
    if skew != 0:
        center = (1000, 600)
        M = cv2.getRotationMatrix2D(center, skew, 1.0)
        img = cv2.warpAffine(img, M, (2000, 1200), borderValue=(255, 255, 255))
        
    # Apply perspective
    if perspective:
        pts1 = np.float32([[0, 0], [2000, 0], [0, 1200], [2000, 1200]])
        pts2 = np.float32([[100, 150], [1850, 50], [50, 1100], [1950, 1150]])
        M = cv2.getPerspectiveTransform(pts1, pts2)
        img = cv2.warpPerspective(img, M, (2000, 1200), borderValue=(255, 255, 255))
        
    return img

def run_tests():
    rectifier = ECGRectifier()
    test_dir = Path(ROOT) / "final_pipeline" / "step2_rectification" / "test_outputs"
    test_dir.mkdir(exist_ok=True)
    
    print("Running Step 2 Rectification Tests...\n")
    
    cases = [
        ("clean_scan", create_test_ecg(skew=0)),
        ("skewed_scan", create_test_ecg(skew=3.5)),
        ("perspective_photo", create_test_ecg(skew=0, perspective=True)),
    ]
    
    for name, img in cases:
        print(f"Testing case: {name}")
        # Save input
        cv2.imwrite(str(test_dir / f"{name}_in.png"), img)
        
        # Process
        res = rectifier.process(img)
        
        if "error" in res:
            print(f"  [FAIL] Error: {res['error']}")
            continue
            
        # Save output
        cv2.imwrite(str(test_dir / f"{name}_out.png"), res["image"])
        
        print(f"  Type: {res['image_type']}")
        print(f"  Quality: {res['quality_score']} ({res['quality_flag']})")
        print(f"  Deskew: {res['skew_angle_deg']}° (Applied: {res['skew_applied']})")
        print(f"  Perspective Corrected: {res['had_perspective']}")
        print(f"  Pulse Found: {res['calibration_pulse']['found']}")
        print("-" * 30)

    print("\nTests complete. Check outputs in final_pipeline/step2_rectification/test_outputs/")

if __name__ == "__main__":
    run_tests()
