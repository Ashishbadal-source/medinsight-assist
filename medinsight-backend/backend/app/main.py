# # from fastapi import FastAPI
# # from app.database import engine
# # from app import models
# # from fastapi import Depends
# # from app.auth import get_current_user

# # app = FastAPI()

# # # models.Base.metadata.create_all(bind=engine)

# # @app.get("/")
# # def home():
# #     return {"message": "Database connected successfully"}

# # @app.post("/reports")
# # def create_report(
# #     report_type: str,
# #     user_id=Depends(get_current_user)
# # ):
# #     return {
# #         "status": "report saved",
# #         "user_id": user_id,
# #         "report_type": report_type
# #     }







# # # from app.auth import get_current_user
# # # from fastapi import Depends

# # # @app.get("/me")
# # # def get_me(user_id=Depends(get_current_user)):
# # #     return {
# # #         "user_id": user_id,
# # #         "message": "You are authenticated"
# # #     }









# import sys
# import os
# sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

# from fastapi import FastAPI, UploadFile, File, Depends
# from fastapi.middleware.cors import CORSMiddleware
# import shutil
# import tempfile

# from app.auth import get_current_user
# from ecg_pipeline.run_pipeline import run_ecg_pipeline

# app = FastAPI()

# # CORS — React frontend ke liye
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "MedInsight Backend Running"}


# @app.post("/analyze/ecg")
# async def analyze_ecg(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user)
# ):
#     # temp file mein save karo
#     suffix = os.path.splitext(file.filename)[-1]
#     with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     try:
#         result = run_ecg_pipeline(tmp_path)
#     finally:
#         os.remove(tmp_path)

#     if not result["success"]:
#         return {"success": False, "error": result["error"]}

#     return result






# import os
# from dotenv import load_dotenv
# load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
# print("JWT SECRET LOADED:", os.getenv('SUPABASE_JWT_SECRET', 'NOT FOUND')[:10])


# import sys
# import os

# # ecg_pipeline root se accessible ho
# ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
# sys.path.insert(0, ROOT_DIR)

# from fastapi import FastAPI, UploadFile, File, Depends
# from fastapi.middleware.cors import CORSMiddleware
# import shutil
# import tempfile

# from app.auth import get_current_user
# from ecg_pipeline.run_pipeline import run_ecg_pipeline

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "MedInsight Backend Running"}

# @app.post("/analyze/ecg")
# async def analyze_ecg(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user)
# ):
#     suffix = os.path.splitext(file.filename)[-1]
#     with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     try:
#         result = run_ecg_pipeline(tmp_path)
#     finally:
#         os.remove(tmp_path)

#     if not result["success"]:
#         return {"success": False, "error": result["error"]}

#     return result




# import os
# import sys
# import tempfile

# BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
# sys.path.insert(0, BASE_DIR)

# from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from app.auth import get_current_user

# app = FastAPI(title="MedInsight AI Backend")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://medinsight-assist.vercel.app",
#         "http://localhost:5173",
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "MedInsight AI backend is running"}

# @app.get("/debug")
# def debug():
#     secret = os.getenv("SUPABASE_JWT_SECRET", "NOT FOUND")
#     return {"secret_length": len(secret), "first_5": secret[:5] if secret else "empty"}

# @app.post("/analyze/ecg")
# async def analyze_ecg(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user),
# ):
#     from ecg_pipeline.run_pipeline import run_ecg_pipeline

#     filename = file.filename or ""
#     ext = filename.rsplit(".", 1)[-1].lower()
#     if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
#         raise HTTPException(status_code=400, detail="Only image files allowed")

#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
#             tmp.write(contents)
#             tmp_path = tmp.name
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

#     try:
#         result = run_ecg_pipeline(tmp_path)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
#     finally:
#         try:
#             os.unlink(tmp_path)
#         except Exception:
#             pass

#     if not result.get("success"):
#         raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))

#     return result










# import os
# import sys
# import tempfile
# import traceback

# BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
# sys.path.insert(0, BASE_DIR)

# from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from app.auth import get_current_user

# app = FastAPI(title="MedInsight AI Backend")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://medinsight-assist.vercel.app",
#         "http://localhost:5173",
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "MedInsight AI backend is running"}

# @app.get("/debug")
# def debug():
#     secret = os.getenv("SUPABASE_JWT_SECRET", "NOT FOUND")
#     return {"secret_length": len(secret), "first_5": secret[:5] if secret else "empty"}

# @app.post("/analyze/ecg")
# async def analyze_ecg(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user),
# ):
#     from ecg_pipeline.run_pipeline import run_ecg_pipeline

#     filename = file.filename or ""
#     ext = filename.rsplit(".", 1)[-1].lower()
#     if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
#         raise HTTPException(status_code=400, detail="Only image files allowed")

#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
#             tmp.write(contents)
#             tmp_path = tmp.name
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

#     try:
#         result = run_ecg_pipeline(tmp_path)
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
#     finally:
#         try:
#             os.unlink(tmp_path)
#         except Exception:
#             pass

#     if not result.get("success"):
#         raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))

#     return result










# import os
# import sys
# import tempfile
# import traceback

# BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
# sys.path.insert(0, BASE_DIR)

# from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from app.auth import get_current_user

# app = FastAPI(title="MedInsight AI Backend")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://medinsight-assist.vercel.app",
#         "http://localhost:5173",
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "MedInsight AI backend is running"}

# @app.get("/debug")
# def debug():
#     secret = os.getenv("SUPABASE_JWT_SECRET", "NOT FOUND")
#     return {"secret_length": len(secret), "first_5": secret[:5] if secret else "empty"}

# @app.post("/analyze/ecg")
# async def analyze_ecg(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user),
# ):
#     from ecg_pipeline.run_pipeline import run_ecg_pipeline

#     filename = file.filename or ""
#     ext = filename.rsplit(".", 1)[-1].lower()
#     if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
#         raise HTTPException(status_code=400, detail="Only image files allowed")

#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
#             tmp.write(contents)
#             tmp_path = tmp.name
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

#     try:
#         result = run_ecg_pipeline(tmp_path)
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
#     finally:
#         try:
#             os.unlink(tmp_path)
#         except Exception:
#             pass

#     if not result.get("success"):
#         raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))

#     return result


# @app.post("/analyze/blood")
# async def analyze_blood(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user),
# ):
#     from blood_pipeline.extract_text import extract_text
#     from blood_pipeline.parse_values import parse_values
#     from blood_pipeline.analyze import analyze_blood

#     filename = file.filename or ""
#     ext = filename.rsplit(".", 1)[-1].lower()
#     if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif", "pdf"):
#         raise HTTPException(status_code=400, detail="Only image or PDF files allowed")

#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
#             tmp.write(contents)
#             tmp_path = tmp.name
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

#     try:
#         text = extract_text(tmp_path)
#         if not text.strip():
#             raise HTTPException(status_code=422, detail="Could not extract text from report")

#         parsed = parse_values(text)
#         if not parsed:
#             raise HTTPException(status_code=422, detail="No blood test values found in report")

#         result = analyze_blood(parsed)

#     except HTTPException:
#         raise
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")
#     finally:
#         try:
#             os.unlink(tmp_path)
#         except Exception:
#             pass

#     return result




# import os
# import sys
# import tempfile
# import traceback

# BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
# sys.path.insert(0, BASE_DIR)

# from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from app.auth import get_current_user

# app = FastAPI(title="MedInsight AI Backend")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://medinsight-assist.vercel.app",
#         "http://localhost:5173",
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "MedInsight AI backend is running"}

# @app.get("/debug")
# def debug():
#     secret = os.getenv("SUPABASE_JWT_SECRET", "NOT FOUND")
#     return {"secret_length": len(secret), "first_5": secret[:5] if secret else "empty"}

# @app.post("/analyze/ecg")
# async def analyze_ecg(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user),
# ):
#     from ecg_pipeline.run_pipeline import run_ecg_pipeline

#     filename = file.filename or ""
#     ext = filename.rsplit(".", 1)[-1].lower()
#     if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
#         raise HTTPException(status_code=400, detail="Only image files allowed")

#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
#             tmp.write(contents)
#             tmp_path = tmp.name
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

#     try:
#         result = run_ecg_pipeline(tmp_path)
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
#     finally:
#         try:
#             os.unlink(tmp_path)
#         except Exception:
#             pass

#     if not result.get("success"):
#         raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))

#     return result


# @app.post("/analyze/blood")
# async def analyze_blood(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user),
# ):
#     from blood_pipeline.extract_text import extract_text
#     from blood_pipeline.parse_values import parse_values
#     from blood_pipeline.analyze import analyze_blood

#     filename = file.filename or ""
#     ext = filename.rsplit(".", 1)[-1].lower()
#     if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif", "pdf"):
#         raise HTTPException(status_code=400, detail="Only image or PDF files allowed")

#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
#             tmp.write(contents)
#             tmp_path = tmp.name
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

#     try:
#         text = extract_text(tmp_path)
#         if not text.strip():
#             raise HTTPException(status_code=422, detail="Could not extract text from report")

#         parsed = parse_values(text)
#         if not parsed:
#             raise HTTPException(status_code=422, detail="No blood test values found in report")

#         result = analyze_blood(parsed)

#     except HTTPException:
#         raise
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")
#     finally:
#         try:
#             os.unlink(tmp_path)
#         except Exception:
#             pass

#     return result


# @app.post("/analyze/xray")
# async def analyze_xray(
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user),
# ):
#     from xray_pipeline.inference import run_xray

#     filename = file.filename or ""
#     ext = filename.rsplit(".", 1)[-1].lower()
#     if ext not in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
#         raise HTTPException(status_code=400, detail="Only image files allowed")

#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
#             tmp.write(contents)
#             tmp_path = tmp.name
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

#     try:
#         result = run_xray(tmp_path)
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
#     finally:
#         try:
#             os.unlink(tmp_path)
#         except Exception:
#             pass

#     if not result.get("success"):
#         raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))

#     return result





















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
USE_NEW_PIPELINE = os.getenv('USE_NEW_PIPELINE', 'false').lower() == 'true'

# Load new pipeline at startup if enabled
if USE_NEW_PIPELINE:
    try:
        from new_pipeline.inference import ECGPipelineManager
        _pipeline = ECGPipelineManager.get_instance()
        _pipeline.load_models(
            seg_weights=os.getenv('SEG_WEIGHTS_PATH',
                                   'weights/ecg_best.pth'),
            class_weights=os.getenv('CLS_WEIGHTS_PATH',
                                     'weights/ecg_classifier.pth')
        )
        print("✅ New ECG pipeline loaded")
    except Exception as e:
        print(f"⚠️ New pipeline load failed: {e} — falling back to old")
        USE_NEW_PIPELINE = False


@app.get("/")
def home():
    return {"message": "MedInsight AI backend is running"}


@app.get("/debug")
def debug():
    secret = os.getenv("SUPABASE_JWT_SECRET", "NOT FOUND")
    return {
        "secret_length": len(secret),
        "first_5": secret[:5] if secret else "empty",
        "pipeline": "new" if USE_NEW_PIPELINE else "old"
    }


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
        raise HTTPException(status_code=400,
                            detail="Only image files allowed")

    # Save temp file
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(
                delete=False, suffix=f".{ext}") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500,
                            detail=f"File save failed: {str(e)}")

    try:
        if USE_NEW_PIPELINE:
            # ── New pipeline ──────────────────────────────────────────────
            result = _pipeline.run(tmp_path)

            if result.get('status') == 'error':
                raise HTTPException(
                    status_code=422,
                    detail=result.get('message', 'Analysis failed'))

            return {
                "success":       True,
                "pipeline":      "new",
                "ecg_signal":    result['ecg_signal'],
                "report":        result['report'],
            }

        else:
            # ── Old pipeline ──────────────────────────────────────────────
            from ecg_pipeline.run_pipeline import run_ecg_pipeline
            result = run_ecg_pipeline(tmp_path)

            if not result.get("success"):
                raise HTTPException(
                    status_code=422,
                    detail=result.get("error", "Analysis failed"))

            return result

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500,
                            detail=f"Pipeline error: {str(e)}")
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
        raise HTTPException(status_code=400,
                            detail="Only image or PDF files allowed")

    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(
                delete=False, suffix=f".{ext}") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500,
                            detail=f"File save failed: {str(e)}")

    try:
        text = extract_text(tmp_path)
        if not text.strip():
            raise HTTPException(status_code=422,
                                detail="Could not extract text from report")

        parsed = parse_values(text)
        if not parsed:
            raise HTTPException(status_code=422,
                                detail="No blood test values found")

        result = analyze_blood(parsed)

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500,
                            detail=f"Analysis error: {str(e)}")
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
        raise HTTPException(status_code=400,
                            detail="Only image files allowed")

    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(
                delete=False, suffix=f".{ext}") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500,
                            detail=f"File save failed: {str(e)}")

    try:
        result = run_xray(tmp_path)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500,
                            detail=f"Pipeline error: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

    if not result.get("success"):
        raise HTTPException(status_code=422,
                            detail=result.get("error", "Analysis failed"))

    return result