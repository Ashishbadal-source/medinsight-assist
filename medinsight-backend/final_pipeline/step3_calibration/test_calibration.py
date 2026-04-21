"""
final_pipeline/step3_calibration/test_calibration.py
Deep verification of Calibration Engine on Real Images.
"""
import os
import cv2
import sys
from pathlib import Path

# Add project root to path
ROOT = Path(__file__).parent.parent.parent
sys.path.append(str(ROOT))

from final_pipeline.step3_calibration.calibrator import ECGCalibrator

def run_test():
    calibrator = ECGCalibrator()
    
    # Use real images from the previous session
    test_images = [
        r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_001-e789079d-4252-44d8-8c52-cf965a646a69.png",
        r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_5-e01e7977-a2d0-4e91-99c3-cedd08be26b2.png",
        r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_4-50f625f5-c0bb-41c1-a5dd-a40efad0c0ab.png"
    ]
    
    print(f"{'Image':<15} | {'px/mm':<10} | {'Pulse?':<8} | {'Conf':<6} | {'Flag'}")
    print("-" * 60)
    
    for path in test_images:
        name = os.path.basename(path)[:15]
        img = cv2.imread(path)
        if img is None:
            print(f"{name:<15} | ERROR")
            continue
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        result = calibrator.calibrate(gray)
        
        print(f"{name:<15} | {result['pixels_per_mm']:>10.2f} | {str(result['pulse_detected']):<8} | {result['calibration_confidence']:<6.2f} | {result['confidence_flag']}")

if __name__ == "__main__":
    run_test()
