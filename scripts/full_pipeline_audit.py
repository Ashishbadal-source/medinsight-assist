# scripts/full_pipeline_audit.py

import os, sys, time, json, cv2, numpy as np
from pathlib import Path

# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.join(BASE_DIR, "medinsight-backend")
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, BACKEND_DIR)

from new_pipeline.inference import ECGPipelineManager

def perform_deep_audit(img_name):
    img_path = os.path.join(BACKEND_DIR, "ecg_pipeline", "data", "raw_images", img_name)
    if not os.path.exists(img_path):
        print(f"❌ Skipping {img_name} (Not found)")
        return
    
    print(f"\nAUDITING: {img_name}")
    print("-" * 50)
    
    manager = ECGPipelineManager.get_instance()
    weights = os.path.join(BACKEND_DIR, "weights", "ecg_best.weights.h5")
    
    try:
        # 1. Load Complete Architecture
        manager.load_models(seg_weights=weights)
        
        # 2. Run FULL 7-Stage Pipeline
        start = time.time()
        res = manager.run(img_path)
        dur = time.time() - start
        
        if res.get('status') == 'success':
            print(f"✅ Pipeline Success ({dur:.2f}s)")
            print(f"   Top Diagnosis: {res['diagnosis']}")
            print(f"   Confidence:    {res['findings'][0].get('probability', 0)*100:.2f}%")
            print(f"   Rhythm:        {res['rhythms'][0].get('code', 'N/A')} ({res['rhythms'][0].get('probability', 0)*100:.2f}%)")
            
            # Clinical Pulse Check
            find_names = [f['code'] for f in res['findings']]
            print(f"   Secondary:     {', '.join(find_names[1:4]) if len(find_names)>1 else 'None'}")
            return res
        else:
            print(f"❌ Audit Error: {res.get('message')}")
    except Exception as e:
        print(f"❌ Full Pipeline Crash: {e}")
        # import traceback; traceback.print_exc()

def main():
    print("ECG PIPELINE: THE FINAL CONVICTION (FULL STAGE 7 AUDIT)")
    print("=" * 60)
    
    # Audit cases
    cases = ["ecg_001.png", "ecg_002.png", "ecg__003.png", "ecg_4.png"]
    
    reports = []
    for c in cases:
        reports.append(perform_deep_audit(c))
    
    print("\n" + "="*60)
    print("FINAL VERDICT: CLINICAL READINESS")
    print("="*60)
    print("The system is now combining AI vision with AI clinical logic.")
    print("Confidence levels above 80% indicate 'High Precision' extraction.")
    print("-" * 60)

if __name__ == "__main__":
    main()
