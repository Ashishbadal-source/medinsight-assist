import os
import sys
import tempfile

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

@app.get("/")
def home():
    return {"message": "MedInsight AI backend is running"}

@app.post("/analyze/ecg")
async def analyze_ecg(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    from ecg_pipeline.run_pipeline import run_ecg_pipeline

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
        result = run_ecg_pipeline(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

    if not result.get("success"):
        raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))

    return result
