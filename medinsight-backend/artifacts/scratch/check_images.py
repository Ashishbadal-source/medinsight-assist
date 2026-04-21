import os
import json

json_path = r'c:\Users\dell\OneDrive\Desktop\Complete\medinsight-assist\medinsight-backend\final_pipeline\step1_gatekeeper\external_test_results.json'

with open(json_path, 'r') as f:
    data = json.load(f)

for res in data['results']:
    name = res['name']
    path = res['path']
    exists = os.path.exists(path)
    print(f"{name}: {exists} ({path})")
