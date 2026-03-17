from fastapi import APIRouter, UploadFile, File, Depends
import shutil, os, uuid
from xray_pipeline.inference import run_xray
from app.auth import get_current_user

router = APIRouter()

@router.post("/analyze-xray")
async def analyze_xray(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    ext = file.filename.split(".")[-1]
    temp_path = f"/tmp/{uuid.uuid4()}.{ext}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = run_xray(temp_path)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return result