print("INFO: Starting script...")
import os
import sys
import torch
import numpy as np
import cv2
import time
import json

print("INFO: Imports complete.")
# Add project root to path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)
print(f"INFO: Project ROOT: {BASE_DIR}")
sys.stdout.flush()

from new_pipeline.inference import ECGPipelineManager

def main():
    print("=== NEW ECG PIPELINE VERIFICATION TEST ===")
    
    # Sample image
    test_img = os.path.join(BASE_DIR, "ecg_pipeline", "data", "raw_images", "ecg_001.png")
    if not os.path.exists(test_img):
        print(f"Error: Sample image not found at {test_img}")
        return

    print(f"Testing image: {test_img}")

    # Initialize Manager
    print("INFO: Getting manager instance...")
    sys.stdout.flush()
    manager = ECGPipelineManager.get_instance()
    manager.device = 'cpu'
    print(f"INFO: Manager on {manager.device}")
    sys.stdout.flush()
    
    seg_weights = os.path.join(BASE_DIR, "weights", "ecg_best.pth")
    class_weights = os.path.join(BASE_DIR, "weights", "ecg_classifier.pth")
    
    try:
        print("INFO: Loading models (this may take a minute on CPU)...")
        sys.stdout.flush()
        manager.load_models(seg_weights, class_weights)
        print("INFO: Models loaded successfully.")
        sys.stdout.flush()
        
        print("\n--- RUNNING PIPELINE ---")
        start_new = time.time()
        new_result = manager.run(test_img)
        dur_new = time.time() - start_new
        
        if new_result['status'] == 'success':
            print(f"Pipeline Duration: {dur_new:.2f}s")
            report = new_result['report']
            print(f"\n--- DIAGNOSTIC REPORT ---")
            print(f"Primary Diagnosis: {report['primary_diagnosis']['description']} ({report['primary_diagnosis']['code']})")
            print(f"Confidence:        {report['primary_diagnosis']['confidence']*100:.2f}%")
            print(f"Overall Severity:  {report['overall_severity']}")
            
            # Save signal for inspection
            signal_path = os.path.join(BASE_DIR, "scripts", "extracted_signal.json")
            with open(signal_path, 'w') as f:
                json.dump(new_result['ecg_signal'], f)
            print(f"\n[OK] Extracted signal saved to: {signal_path}")
        else:
            print(f"Pipeline Error: {new_result['message']}")
    except Exception as e:
        print(f"Pipeline Failed: {e}")
        import traceback
        traceback.print_exc()

    print("\n=== VERIFICATION COMPLETE ===")

if __name__ == "__main__":
    main()
