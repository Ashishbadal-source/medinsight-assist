import os
import sys
import tempfile
import traceback

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, BASE_DIR)

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.auth import get_current_user

app = FastAPI(title="MedInsight AI Backend")

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

# ── Pipeline switch ───────────────────────────────────────────────────────────
USE_NEW_PIPELINE = os.getenv('USE_NEW_PIPELINE', 'true').lower() == 'true'

# Load new pipeline at startup if enabled
if USE_NEW_PIPELINE:
    try:
        from new_pipeline.inference import ECGPipelineManager
        _pipeline = ECGPipelineManager.get_instance()
        _pipeline.load_models(
            seg_weights=os.getenv('SEG_WEIGHTS_PATH', 'weights/ecg_best.pth'),
            class_weights=os.getenv('CLS_WEIGHTS_PATH', 'weights/ecg_classifier.pth')
        )
        print("✅ New ECG pipeline loaded")
    except Exception as e:
        print(f"⚠️ New pipeline load failed: {e} — falling back to old")
        USE_NEW_PIPELINE = False

@app.get("/")
def home():
    return {"message": "MedInsight AI backend is running"}

@app.get("/pipeline-status")
def pipeline_status():
    return {
        "active_pipeline": "new" if USE_NEW_PIPELINE else "old",
        "new_pipeline_ready": USE_NEW_PIPELINE,
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

    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

    try:
        if USE_NEW_PIPELINE:
            result = _pipeline.run(tmp_path)
            if result.get('status') == 'error':
                raise HTTPException(status_code=422, detail=result.get('message', 'Analysis failed'))
            return {
                "success": True,
                "pipeline": "new",
                "ecg_signal": result['ecg_signal'],
                "report": result['report'],
            }
        else:
            from ecg_pipeline.run_pipeline import run_ecg_pipeline
            result = run_ecg_pipeline(tmp_path)
            if not result.get("success"):
                raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))
            return result
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

@app.post("/analyze/blood")
async def analyze_blood(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    from blood_pipeline.extract_text import extract_text
    from blood_pipeline.parse_values import parse_values
    from blood_pipeline.analyze import analyze_blood

    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif", "pdf"):
        raise HTTPException(status_code=400, detail="Only image or PDF files allowed")

    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

    try:
        text = extract_text(tmp_path)
        if not text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from report")
        parsed = parse_values(text)
        if not parsed:
            raise HTTPException(status_code=422, detail="No blood test values found")
        result = analyze_blood(parsed)
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass
    return result

@app.post("/analyze/xray")
async def analyze_xray(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    from xray_pipeline.inference import run_xray

    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

    try:
        result = run_xray(tmp_path)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

    if not result.get("success"):
        raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))

    return result

