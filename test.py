import requests

TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkhRYUhwQkRid3Z4U2tGY0oiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3llbmd1eWl3aml0Y2lsaWlscWV0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwY2Y3YWE5YS01ODc0LTQxZjAtODc3MS0wMDFkOTlhNDZhNGUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcyODk2NTU2LCJpYXQiOjE3NzI4OTI5NTYsImVtYWlsIjoiaWRoNDgxNkBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiaWRoNDgxNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIwY2Y3YWE5YS01ODc0LTQxZjAtODc3MS0wMDFkOTlhNDZhNGUifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3Mjg5Mjk1Nn1dLCJzZXNzaW9uX2lkIjoiYmQ4NDFjYmItNjRjMS00NzY3LTg2NGUtOTExNDU1ODA4MGQxIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.Ch2SzL1E8F-BEIhbcCVTCKrIgbEL8ZiC1xEcdIZTcNw"

IMAGE = r"C:\Users\dell\OneDrive\Desktop\Complete\medinsight-assist\ecg_pipeline\data\raw_images\ecg__003.png"

print("Sending request... (2-3 min wait karo pehli baar)")

with open(IMAGE, "rb") as f:
    r = requests.post(
        "https://medinsight-assist.onrender.com/analyze/ecg",
        headers={"Authorization": f"Bearer {TOKEN}"},
        files={"file": f},
        timeout=300
    )

print(f"Status: {r.status_code}")
print(f"Response: {r.text}")
