# backend/api/ecg_routes.py

# from fastapi import APIRouter, UploadFile
# from services.ecg_service import ECGService

# router = APIRouter()
# ecg_service = ECGService()

# @router.post("/ecg/analyze")
# async def analyze_ecg(file: UploadFile):
#     path = f"/tmp/{file.filename}"

#     with open(path, "wb") as f:
#         f.write(await file.read())

#     result = ecg_service.process_ecg(path)
#     return result



# from fastapi import APIRouter, UploadFile
# from services.ecg_service import analyze_ecg

# router = APIRouter()

# @router.post("/ecg/analyze")
# async def analyze(file: UploadFile):

#     path = f"/tmp/{file.filename}"

#     with open(path, "wb") as f:
#         f.write(await file.read())

#     result = analyze_ecg(path)

#     return result






from fastapi import APIRouter, UploadFile
from services.ecg_service import analyze_ecg
import tempfile
import os

router = APIRouter()

@router.post("/ecg/analyze")
async def analyze(file: UploadFile):

    # ✅ Windows compatible temp path
    tmp_dir = tempfile.gettempdir()
    path = os.path.join(tmp_dir, file.filename)

    with open(path, "wb") as f:
        f.write(await file.read())

    result = analyze_ecg(path)

    # ✅ Temp file delete karo baad mein
    if os.path.exists(path):
        os.remove(path)

    return result