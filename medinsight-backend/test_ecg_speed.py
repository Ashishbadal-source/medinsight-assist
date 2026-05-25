import sys
import os
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from ecg_pipeline.run_pipeline import run_ecg_pipeline

sample_path = "test_samples/ecg_sample.jpg" # Assuming this exists or we can use another
if not os.path.exists(sample_path):
    print(f"Sample not found: {sample_path}")
    sys.exit(1)

start = time.time()
result = run_ecg_pipeline(sample_path)
end = time.time()

print(f"Time taken: {end - start:.2f} seconds")
print(f"Success: {result.get('success')}")
