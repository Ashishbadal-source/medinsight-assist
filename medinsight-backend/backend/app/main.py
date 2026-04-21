# backend/app/main.py

import os
import sys
import tempfile
import traceback
import shutil
import requests
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Ensure pipeline modules are discoverable
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, BASE_DIR)

from app.auth import get_current_user

app = FastAPI(title="MedInsight AI Backend — Clinical Dashboard")

print("**************************************************")
print(f"📍 SERVER RUNNING FROM: {os.path.abspath(__file__)}")
print(f"📁 WORKING DIRECTORY: {os.getcwd()}")
print("**************************************************")

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://medinsight-assist.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── CONFIGURATION & PIPELINE SELECTOR ─────────────────────────────────────────
from pipeline_config import ACTIVE_PIPELINE

HF_TOKEN = os.getenv('HF_TOKEN', '')
REPO_ID = os.getenv('HF_REPO_ID', 'Ashish4816/ecg-model')

def download_weights_if_missing():
    """Automated weight downloader for HuggingFace Spaces."""
    weights_v1 = {
        "ecg_best.weights.h5": f"https://huggingface.co/{REPO_ID}/resolve/main/ecg_best.weights.h5",
        "ecg_classifier.pth": f"https://huggingface.co/{REPO_ID}/resolve/main/ecg_classifier.pth"
    }
    
    os.makedirs("weights", exist_ok=True)
    headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}
    
    for filename, url in weights_v1.items():
        local_path = Path("weights") / filename
        if not local_path.exists():
            print(f"📥 Downloading {filename} from HF...")
            try:
                r = requests.get(url, headers=headers, stream=True)
                r.raise_for_status()
                with open(local_path, "wb") as f:
                    for chunk in r.iter_content(8192):
                        f.write(chunk)
                print(f"✅ Downloaded {filename}")
            except Exception as e:
                print(f"⚠️ Failed to download {filename}: {e}")

@app.on_event("startup")
async def startup_event():
    global _pipeline, _final_pipeline
    
    # Initialize FINAL Pipeline
    if ACTIVE_PIPELINE == "final":
        try:
            from final_pipeline.run_final_pipeline import MedInsightECGPipeline
            _final_pipeline = MedInsightECGPipeline()
            print("**************************************************")
            print("🚀 MedInsight FINAL Medical-Grade Pipeline Ready!")
            print("**************************************************")
        except Exception as e:
            print("**************************************************")
            print(f"⚠️ CRITICAL: FINAL PIPELINE FAILED TO LOAD: {e}")
            print("**************************************************")
            
    # Initialize NEW (Beta) Pipeline
    if ACTIVE_PIPELINE == "new":
        print("💡 Mode: Using BETA CNN Pipeline")
        download_weights_if_missing()
        # ... (rest of new pipeline logic)

# ── ENDPOINTS ─────────────────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "MedInsight AI backend is running"}

@app.get("/pipeline-status")
def pipeline_status():
    return {
        "active_pipeline": ACTIVE_PIPELINE,
        "repo_id": REPO_ID
    }

@app.post("/analyze/ecg")
async def analyze_ecg(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        if ACTIVE_PIPELINE == "final":
            # ── Final Medical-Grade Pipeline ──────────────────────────────────
            result = _final_pipeline.process(tmp_path)
            if not result.get("success"):
                raise HTTPException(status_code=422, detail=result.get("error", "Processing failed"))
            
            # Map Medical diagnostics to Frontend UI expected fields
            summary = result['diagnostics']
            findings_list = summary.get("findings", [])
            primary_diag = "Normal Sinus Rhythm" if not findings_list else findings_list[0]
            
            return {
                "success":       True,
                "signature":     "MEDINSIGHT_FINAL_V1",
                "pipeline":      "final",
                "diagnosis":     primary_diag,
                "findings":      findings_list,
                "rhythms":       [summary.get("rhythm", "Unknown")],
                "confidence":    round(result['overall_confidence'] * 100, 1),
                "diagnostics":   summary,
                "quality":       result['quality_scores'],
                "signals":       result['signals'],
                "metadata":      result['metadata']
            }
            
        elif ACTIVE_PIPELINE == "new":
            # ── Beta 7-Stage Pipeline ──────────────────────────────────────────
            result = _pipeline.run(tmp_path)
            if result.get('status') == 'error':
                raise HTTPException(status_code=422, detail=result.get('message'))

            return {
                "success":       True,
                "pipeline":      "new",
                "diagnosis":     result['diagnosis'],
                "findings":      result['all_findings'],
                "rhythms":       result['rhythms'],
                "ecg_signal":    result['ecg_signal'],
            }
        else:
            # ── Legacy Pipeline ───────────────────────────────────────────────
            from ecg_pipeline.run_pipeline import run_ecg_pipeline
            result = run_ecg_pipeline(tmp_path)
            if not result.get("success"):
                raise HTTPException(status_code=422, detail=result.get("error"))
            return {**result, "pipeline": "old"}

    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.post("/analyze/blood")
async def analyze_blood(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    from blood_pipeline.extract_text import extract_text
    from blood_pipeline.parse_values import parse_values
    from blood_pipeline.analyze import analyze_blood

    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        text = extract_text(tmp_path)
        parsed = parse_values(text)
        if not parsed:
            raise HTTPException(status_code=422, detail="No values found")
        return analyze_blood(parsed)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.post("/analyze/xray")
async def analyze_xray(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    from xray_pipeline.inference import run_xray
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    try:
        return run_xray(tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)