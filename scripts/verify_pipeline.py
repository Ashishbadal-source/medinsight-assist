import os
import sys
import torch
import traceback

# Add project root to path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

print(f"Project ROOT: {BASE_DIR}")
print(f"Torch version: {torch.__version__}")

try:
    print("Attempting to import ECGPipelineManager...")
    # Fix the import to match our root structure
    from new_pipeline.inference import ECGPipelineManager
    
    print("Initializing Manager...")
    manager = ECGPipelineManager.get_instance()
    
    # Use the weights I copied to root/weights
    seg_weights = os.path.join(BASE_DIR, "weights", "ecg_best.pth")
    class_weights = os.path.join(BASE_DIR, "weights", "ecg_classifier.pth")
    
    print(f"Loading weights from:\n  Seg: {seg_weights}\n  Class: {class_weights}")
    
    # We'll try loading it on CPU
    manager.device = 'cpu'
    manager.load_models(seg_weights, class_weights)
    
    print("[OK] SUCCESS: Pipeline initialized and models loaded!")
    
    # Test run on sample image
    test_img = os.path.join(BASE_DIR, "ecg_pipeline", "data", "raw_images", "ecg_001.png")
    if os.path.exists(test_img):
        print(f"Running test on: {test_img}")
        result = manager.run(test_img)
        if result['status'] == 'success':
            print("[OK] TEST SUCCESS: Result generated!")
            # print(f"Report: {result['report']['primary_diagnosis']}")
        else:
            print(f"[ERROR] TEST FAILED: {result.get('message')}")
    else:
        print(f"[WARN] Test image not found at {test_img}")

except Exception:
    print("[ERROR] CRITICAL FAILURE during initialization:")
    traceback.print_exc()
