# backend/api/ecg_routes.py

from fastapi import APIRouter, UploadFile
from services.ecg_service import ECGService

router = APIRouter()
ecg_service = ECGService()

@router.post("/ecg/analyze")
async def analyze_ecg(file: UploadFile):
    path = f"/tmp/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    result = ecg_service.process_ecg(path)
    return result
