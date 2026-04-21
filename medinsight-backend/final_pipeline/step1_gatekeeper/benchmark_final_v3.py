"""
benchmark_final_v3.py
Compares the Gatekeeper performance across 3 pipeline versions:
1. Old (ecg_pipeline)
2. New (new_pipeline)
3. Final (final_pipeline v4.2)

Test Set: 9 Real Images (3 ECG, 6 Non-ECG/Noise)
"""
import os
import sys
import cv2
import numpy as np
import json
from pathlib import Path

# Add all pipeline roots to sys.path
ROOT = Path(r'c:\Users\dell\OneDrive\Desktop\Complete\medinsight-assist\medinsight-backend')
sys.path.append(str(ROOT))

# Imports for Old Pipeline
from ecg_pipeline.quality_check.run_quality_check import run_quality_checks as old_gatekeeper

# Imports for Final Pipeline
from final_pipeline.step1_gatekeeper.gatekeeper import ECGGatekeeper
final_gatekeeper = ECGGatekeeper()

def run_new_gatekeeper(img):
    # New pipeline has no gatekeeper, it always passes.
    return True, "No gatekeeper"

def run_benchmark():
    # Load test image list from existing results file
    json_path = ROOT / 'final_pipeline' / 'step1_gatekeeper' / 'external_test_results.json'
    with open(json_path, 'r') as f:
        data = json.load(f)

    test_cases = data['results']
    
    results = []
    
    print(f"{'Image Name':<20} | {'Ground Truth':<12} | {'Old Pipe':<10} | {'New Pipe':<10} | {'Final v4.2':<10}")
    print("-" * 75)
    
    for case in test_cases:
        name = case['name']
        path = case['path']
        expected = case['expected_is_ecg']
        
        img = cv2.imread(path)
        if img is None:
            print(f"{name:<20} | [FILE ERROR]")
            continue
            
        # 1. Old Pipeline
        try:
            old_pass, _ = old_gatekeeper(img)
        except Exception:
            old_pass = "ERROR"
            
        # 2. New Pipeline
        new_pass = True # Always passes
        
        # 3. Final Pipeline (v3.1)
        try:
            # We use the tuned gatekeeper
            final_res = final_gatekeeper.decide(path)
            final_pass = final_res['is_ecg']
        except Exception as e:
            final_pass = f"ERR: {str(e)[:10]}"

        # Formatting
        gt_str = "ECG" if expected else "NON-ECG"
        old_str = "PASS" if old_pass == True else ("FAIL" if old_pass == False else "ERR")
        new_str = "PASS" if new_pass else "FAIL"
        final_str = "PASS" if final_pass == True else ("FAIL" if final_pass == False else "ERR")
        
        # Color marking (simulated with status)
        row = f"{name:<20} | {gt_str:<12} | {old_str:<10} | {new_str:<10} | {final_str:<10}"
        
        # Check correctness
        if (final_pass == expected):
            row += " [CORRECT]"
        else:
            row += " [WRONG]"
            
        print(row)
        
        results.append({
            "name": name,
            "expected": expected,
            "old": old_pass,
            "new": new_pass,
            "final": final_pass
        })

    # Summary Statistics
    print("\n" + "="*40)
    print("SUMMARY (Accuracy %)")
    print("="*40)
    
    def calc_acc(pipe_key):
        correct = 0
        total = 0
        for r in results:
            val = r[pipe_key]
            if isinstance(val, bool):
                if val == r['expected']:
                    correct += 1
                total += 1
        return (correct / total * 100) if total > 0 else 0

    print(f"Old Pipeline:   {calc_acc('old'):.1f}%")
    print(f"New Pipeline:   {calc_acc('new'):.1f}% (0% Specificity)")
    print(f"Final v4.2:     {calc_acc('final'):.1f}%")
    print("="*40)

if __name__ == "__main__":
    run_benchmark()
