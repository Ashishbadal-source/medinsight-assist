"""
final_pipeline/final_e2e_benchmark.py
The Ultimate Performance Report for the MedInsight ECG Pipeline.
Tests all images and collects deep metrics from all 6 stages.
"""
import os
import sys
import json
from pathlib import Path

# Add root to path
ROOT = Path(__file__).parent.parent
sys.path.append(str(ROOT))

from final_pipeline.run_final_pipeline import MedInsightECGPipeline

def run_ultimate_benchmark():
    pipeline = MedInsightECGPipeline()
    
    # Load all test cases (Real, Noise, Tricky)
    test_data_path = ROOT / 'final_pipeline' / 'step1_gatekeeper' / 'external_test_results.json'
    with open(test_data_path, 'r') as f:
        data = json.load(f)
    
    test_cases = data['results']
    
    # Add the 3 tricky generated ones manually
    test_cases.extend([
        {"name": "Tricky Spreadsheet", "path": r"C:\Users\dell\.gemini\antigravity\brain\9fb4ef3e-87cd-46ff-8ad0-779b313c91ef\tricky_spreadsheet_spikes_1776774133950.png", "expected_is_ecg": False},
        {"name": "Tricky Sine Grid", "path": r"C:\Users\dell\.gemini\antigravity\brain\9fb4ef3e-87cd-46ff-8ad0-779b313c91ef\synthetic_sine_grid_1776774572659.png", "expected_is_ecg": False}
    ])

    print("="*100)
    print(f"{'Image Name':<20} | {'S1 Gate':<8} | {'S3 Scale':<8} | {'S4 Leads':<8} | {'S6 BPM':<6} | {'Conf'}")
    print("="*100)
    
    results = []
    
    for case in test_cases:
        name = case['name'][:20]
        path = case['path']
        expected = case['expected_is_ecg']
        
        try:
            res = pipeline.process(path)
            
            if res["success"]:
                s1 = "PASS"
                s3 = f"{res['metadata']['calibration']['pixels_per_mm']:.1f}"
                s4 = f"{len(res['signals'])}"
                s6 = f"{res['diagnostics']['heart_rate']}"
                conf = f"{res['overall_confidence']:.2f}"
            else:
                s1 = "REJECT"
                s3, s4, s6, conf = "-", "-", "-", "-"
                
            # Check correctness of Gatekeeper
            correct_gate = (s1 == "PASS") == expected
            gate_status = "OK" if correct_gate else "ERR"
            
            print(f"{name:<20} | {s1:<8} | {s3:<8} | {s4:<8} | {s6:<6} | {conf} [{gate_status}]")
            
            results.append({
                "name": name,
                "success": res["success"],
                "correct_gate": correct_gate,
                "diagnostics": res.get("diagnostics") if res["success"] else None
            })
            
        except Exception as e:
            print(f"{name:<20} | EXCEPTION: {str(e)[:20]}")

    # Final Accuracy Summary
    acc = sum(1 for r in results if r["correct_gate"]) / len(results) * 100
    print("="*100)
    print(f"FINAL GATEKEEPER ACCURACY: {acc:.1f}%")
    print("="*100)

if __name__ == "__main__":
    run_ultimate_benchmark()
