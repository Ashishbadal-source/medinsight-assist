import requests

TOKEN = input("Token paste karo: ").strip()

IMAGE = r"C:\Users\dell\OneDrive\Desktop\Complete\medinsight-assist\ecg_pipeline\data\raw_images\ecg__003.png"

print("Sending request...")

with open(IMAGE, "rb") as f:
    r = requests.post(
        "http://localhost:8000/analyze/ecg",
        headers={"Authorization": f"Bearer {TOKEN}"},
        files={"file": f},
        timeout=300
    )

print(f"Status: {r.status_code}")
print(f"Response: {r.text}")