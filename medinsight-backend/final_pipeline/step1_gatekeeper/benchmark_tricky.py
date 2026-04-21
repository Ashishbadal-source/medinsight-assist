import os
import sys
import cv2
import json
from pathlib import Path

ROOT = Path(r'c:\Users\dell\OneDrive\Desktop\Complete\medinsight-assist\medinsight-backend')
sys.path.append(str(ROOT))

from final_pipeline.step1_gatekeeper.gatekeeper import ECGGatekeeper
gk = ECGGatekeeper()

tricky_images = [
    ("Spreadsheet Spikes", r"C:\Users\dell\.gemini\antigravity\brain\9fb4ef3e-87cd-46ff-8ad0-779b313c91ef\tricky_spreadsheet_spikes_1776774133950.png"),
    ("Sine Grid", r"C:\Users\dell\.gemini\antigravity\brain\9fb4ef3e-87cd-46ff-8ad0-779b313c91ef\synthetic_sine_grid_1776774572659.png"),
    ("Medical Report", r"C:\Users\dell\.gemini\antigravity\brain\9fb4ef3e-87cd-46ff-8ad0-779b313c91ef\medical_report_lines_1776774364667.png")
]

print(f"{'Tricky Image':<20} | {'Expected':<10} | {'v4.6 Result':<12} | {'Reason'}")
print("-" * 65)

for name, path in tricky_images:
    res = gk.decide(path)
    status = "PASS" if res['is_ecg'] else "FAIL"
    reason = res.get('reason', 'ok')
    print(f"{name:<20} | NON-ECG   | {status:<12} | {reason}")
