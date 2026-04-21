"""
final_pipeline/MASTER_SYSTEM_VALIDATION.py
Comprehensive End-to-End Stress Test for the MedInsight Final Pipeline.
"""
import os
import sys
import json
import time
from pathlib import Path

# Setup paths
ROOT = Path(__file__).parent.parent
sys.path.append(str(ROOT))

from final_pipeline.run_final_pipeline import MedInsightECGPipeline
from pipeline_config import ACTIVE_PIPELINE

def run_master_test():
    print("="*80)
    print("[SYSTEM] MEDINSIGHT MASTER SYSTEM VALIDATION")
    print(f"[SYSTEM] MODE: {ACTIVE_PIPELINE.upper()} PIPELINE")
    print("="*80)
    
    if ACTIVE_PIPELINE != "final":
        print("[ERROR] Master Switch is NOT set to 'final'. Aborting test.")
        return

    pipeline = MedInsightECGPipeline()
    
    # Test Data Set
    test_cases = [
        {"name": "Clinical Scan (ecg_4)", "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_4-50f625f5-c0bb-41c1-a5dd-a40efad0c0ab.png", "expect": "PASS"},
        {"name": "Tricky Spreadsheet", "path": r"C:\Users\dell\.gemini\antigravity\brain\9fb4ef3e-87cd-46ff-8ad0-779b313c91ef\tricky_spreadsheet_spikes_1776774133950.png", "expect": "REJECT"},
        {"name": "Sine Wave Trap", "path": r"C:\Users\dell\.gemini\antigravity\brain\9fb4ef3e-87cd-46ff-8ad0-779b313c91ef\synthetic_sine_grid_1776774572659.png", "expect": "REJECT"},
        {"name": "Noise Image", "path": r"C:\Users\dell\OneDrive\Desktop\Complete\medinsight-assist\medinsight-backend\final_pipeline\step1_gatekeeper\noise.png", "expect": "REJECT"}
    ]

    summary = []

    for case in test_cases:
        print(f"\n[TEST] Running: {case['name']}...")
        start = time.time()
        
        try:
            res = pipeline.process(case['path'])
            duration = time.time() - start
            
            status = "PASS" if res["success"] else "REJECT"
            is_correct = status == case["expect"]
            
            print(f"   - Result: {status}")
            print(f"   - Match Expectation: {'[OK]' if is_correct else '[FAIL]'}")
            
            if res["success"]:
                print(f"   - Confidence: {res['overall_confidence'] * 100:.2f}%")
                print(f"   - Lead Extraction: {len(res['signals'])} leads found.")
                print(f"   - Heart Rate: {res['diagnostics']['heart_rate']} BPM")
            
            summary.append({
                "case": case["name"],
                "status": status,
                "correct": is_correct,
                "confidence": res.get("overall_confidence", 0) if res["success"] else 0,
                "time": duration
            })
            
        except Exception as e:
            print(f"   - [EXCEPTION] Error: {str(e)}")

    print("\n" + "="*80)
    print("FINAL MASTER REPORT")
    print("="*80)
    
    total_correct = sum(1 for s in summary if s["correct"])
    accuracy = (total_correct / len(test_cases)) * 100
    
    for s in summary:
        icon = "[CORRECT]" if s["correct"] else "[WRONG]"
        print(f"{icon} {s['case']:<30} | {s['status']:<8} | {s['time']:.2f}s | Conf: {s['confidence']*100:.1f}%")
        
    print("-" * 80)
    print(f"[RESULT] SYSTEM ACCURACY: {accuracy:.1f}%")
    print("="*80)

if __name__ == "__main__":
    run_master_test()
