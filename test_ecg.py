# from backend.services.ecg_service import process_ecg_image

# res = process_ecg_image("ecg_pipeline/data/raw_images/ecg_001.png")
# print(res["status"])

# if res["status"] == "success":
#     print(res["ecg"].shape)



from ecg_pipeline.run_pipeline import process_ecg_image

result = process_ecg_image("sample_ecg.jpg")
print(result)

