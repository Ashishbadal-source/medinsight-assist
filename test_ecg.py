from backend.services.ecg_service import process_ecg_image

res = process_ecg_image("ecg_pipeline/data/raw_images/ecg_001.png")
print(res["status"])

if res["status"] == "success":
    print(res["ecg"].shape)
