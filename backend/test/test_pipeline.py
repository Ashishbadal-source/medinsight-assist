# backend/tests/test_pipeline.py

from services.ecg_service import ECGService

service = ECGService()
out = service.process_ecg("sample_ecg.jpg")
print(out)
