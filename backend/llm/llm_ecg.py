from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import re
import json

# -------------------------------
# Step 1: Dummy ECG report
# -------------------------------
ecg_report = """
Heart Rate: 105 bpm
Rhythm: Irregular
ST Elevation: Present
Diagnosis: Atrial Fibrillation
Confidence: 86%
"""

# -------------------------------
# Step 2: Load model (CPU-friendly)
# -------------------------------
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

print("Loading model... CPU may be slow")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
print("Model loaded ✅")

# -------------------------------
# Step 3: Prompt for LLM
# -------------------------------
prompt = f"""
You are a cardiologist. Explain this ECG report briefly:
{ecg_report}
"""

inputs = tokenizer(prompt, return_tensors="pt")

# -------------------------------
# Step 4: Generate output (short & fast)
# -------------------------------
outputs = model.generate(
    **inputs,
    max_new_tokens=100,       # short output
    do_sample=True,
    top_p=0.9,
    top_k=50,
    repetition_penalty=1.2
)

raw_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("\nRAW LLM OUTPUT:\n")
print(raw_text)

# -------------------------------
# Step 5: Extract structured JSON
# -------------------------------
# Simple regex-based extraction
def extract_ecg_fields(text):
    return {
        "HeartRate": re.search(r"Heart Rate: (.+)", ecg_report).group(1),
        "Rhythm": re.search(r"Rhythm: (.+)", ecg_report).group(1),
        "ST_Elevation": re.search(r"ST Elevation: (.+)", ecg_report).group(1),
        "Diagnosis": re.search(r"Diagnosis: (.+)", ecg_report).group(1),
        "Confidence": re.search(r"Confidence: (.+)", ecg_report).group(1),
        "LLM_Interpretation": text.strip()
    }

structured_output = extract_ecg_fields(raw_text)

# -------------------------------
# Step 6: Print JSON
# -------------------------------
print("\nSTRUCTURED JSON OUTPUT:\n")
print(json.dumps(structured_output, indent=4))
