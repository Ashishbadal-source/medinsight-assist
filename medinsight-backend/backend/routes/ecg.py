from fastapi import APIRouter, UploadFile, File
import shutil
from backend.services.ecg_service import process_ecg_image

router = APIRouter()

@router.post("/upload-ecg")
async def upload_ecg(file: UploadFile = File(...)):

    file_path = f"temp/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = process_ecg_image(file_path)

    if result["status"] == "retry":
        return {
            "status": "retry",
            "message": result["reason"]
        }

    return {
        "status": "success",
        "message": "ECG processed successfully"
    }
