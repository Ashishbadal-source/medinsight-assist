"""
final_pipeline/step4_segmentation/test_segmentation.py
End-to-End Test (Steps 1-4) on Real Images.
"""
import os
import cv2
import sys
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
sys.path.append(str(ROOT))

from final_pipeline.step1_gatekeeper.gatekeeper import ECGGatekeeper
# from final_pipeline.step2_rectification.rectifier import ECGRectifier # Assuming implemented
from final_pipeline.step3_calibration.calibrator import ECGCalibrator
from final_pipeline.step4_segmentation.segmenter import ECGSegmenter

def run_e2e_test():
    gatekeeper = ECGGatekeeper()
    calibrator = ECGCalibrator()
    segmenter = ECGSegmenter()
    
    test_images = [
        r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_001-e789079d-4252-44d8-8c52-cf965a646a69.png",
        r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_5-e01e7977-a2d0-4e91-99c3-cedd08be26b2.png"
    ]
    
    for path in test_images:
        name = os.path.basename(path)
        print(f"\n>>> TESTING: {name}")
        
        # Step 1: Gatekeeper
        res1 = gatekeeper.decide(path)
        if not res1['is_ecg']:
            print("Step 1 Failed: Not an ECG")
            continue
            
        img = cv2.imread(path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Step 3: Calibrate
        res3 = calibrator.calibrate(gray)
        print(f"Step 3: Scale = {res3['pixels_per_mm']:.2f} px/mm")
        
        # Step 4: Segment
        res4 = segmenter.segment(gray)
        print(f"Step 4: Detected Layout = {res4['layout_type']}")
        print(f"Step 4: Lead Count = {len(res4['leads'])}")
        
        # Verify 12 leads
        if len(res4['leads']) >= 12:
            print("SUCCESS: 12 Leads Segmented Correctly.")
            # Print first 3 leads for verification
            for lead in res4['leads'][:3]:
                print(f"  - Lead {lead['name']}: {lead['crop_box']}")
        else:
            print(f"FAILURE: Only found {len(res4['leads'])} leads.")

if __name__ == "__main__":
    run_e2e_test()
