# from transformers import AutoTokenizer, AutoModelForCausalLM
# import torch
# import re
# import json

# # -------------------------------
# # Step 1: Dummy ECG report
# # -------------------------------
# ecg_report = """
# Heart Rate: 105 bpm
# Rhythm: Irregular
# ST Elevation: Present
# Diagnosis: Atrial Fibrillation
# Confidence: 86%
# """

# # -------------------------------
# # Step 2: Load model (CPU-friendly)
# # -------------------------------
# model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

# print("Loading model... CPU may be slow")
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForCausalLM.from_pretrained(model_name)
# print("Model loaded ✅")

# # -------------------------------
# # Step 3: Prompt for LLM
# # -------------------------------
# prompt = f"""
# You are a cardiologist. Explain this ECG report briefly:
# {ecg_report}
# """

# inputs = tokenizer(prompt, return_tensors="pt")

# # -------------------------------
# # Step 4: Generate output (short & fast)
# # -------------------------------
# outputs = model.generate(
#     **inputs,
#     max_new_tokens=100,       # short output
#     do_sample=True,
#     top_p=0.9,
#     top_k=50,
#     repetition_penalty=1.2
# )

# raw_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
# print("\nRAW LLM OUTPUT:\n")
# print(raw_text)

# # -------------------------------
# # Step 5: Extract structured JSON
# # -------------------------------
# # Simple regex-based extraction
# def extract_ecg_fields(text):
#     return {
#         "HeartRate": re.search(r"Heart Rate: (.+)", ecg_report).group(1),
#         "Rhythm": re.search(r"Rhythm: (.+)", ecg_report).group(1),
#         "ST_Elevation": re.search(r"ST Elevation: (.+)", ecg_report).group(1),
#         "Diagnosis": re.search(r"Diagnosis: (.+)", ecg_report).group(1),
#         "Confidence": re.search(r"Confidence: (.+)", ecg_report).group(1),
#         "LLM_Interpretation": text.strip()
#     }

# structured_output = extract_ecg_fields(raw_text)

# # -------------------------------
# # Step 6: Print JSON
# # -------------------------------
# print("\nSTRUCTURED JSON OUTPUT:\n")
# print(json.dumps(structured_output, indent=4))






# backend/llm/llm_ecg.py
# from transformers import AutoTokenizer, AutoModelForCausalLM
# import torch
# import re
# import json

# # Load model once (CPU-friendly)
# model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForCausalLM.from_pretrained(model_name)

# def analyze_ecg(ecg_report):
#     prompt = f"""
# You are a cardiologist. Explain this ECG report in detail:
# {ecg_report}
# """

#     inputs = tokenizer(prompt, return_tensors="pt")

#     outputs = model.generate(
#         **inputs,
#         max_new_tokens=150,
#         do_sample=True,
#         top_p=0.9,
#         top_k=50,
#         repetition_penalty=1.2
#     )

#     raw_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

#     # Structured JSON output
#     structured_output = {
#         "HeartRate": re.search(r"Heart Rate: (.+)", ecg_report).group(1),
#         "Rhythm": re.search(r"Rhythm: (.+)", ecg_report).group(1),
#         "ST_Elevation": re.search(r"ST Elevation: (.+)", ecg_report).group(1),
#         "Diagnosis": re.search(r"Diagnosis: (.+)", ecg_report).group(1),
#         "Confidence": re.search(r"Confidence: (.+)", ecg_report).group(1),
#         "LLM_Interpretation": raw_text.strip()
#     }

#     return structured_output







# from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
# import torch
# import re

# model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

# print("Loading TinyLlama model...")
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForCausalLM.from_pretrained(
#     model_name,
#     dtype=torch.float32,   # torch_dtype → dtype
# )

# pipe = pipeline(
#     "text-generation",
#     model=model,
#     tokenizer=tokenizer
# )
# print("TinyLlama loaded ✅")


# def safe_extract(pattern, text, default="N/A"):
#     """Safe regex — no crash if field missing"""
#     match = re.search(pattern, text)
#     return match.group(1).strip() if match else default


# def analyze_ecg(ecg_report: str) -> dict:
#     # TinyLlama chat template format
#     messages = [
#         {
#             "role": "system",
#             "content": "You are a cardiologist AI. Analyze ECG reports and explain findings clearly."
#         },
#         {
#             "role": "user",
#             "content": f"Analyze this ECG report and explain what it means medically:\n{ecg_report}"
#         }
#     ]

#     # Apply chat template
#     formatted_prompt = tokenizer.apply_chat_template(
#         messages,
#         tokenize=False,
#         add_generation_prompt=True
#     )

#     output = pipe(
#         formatted_prompt,
#         max_new_tokens=300,
#         do_sample=True,
#         temperature=0.3,      # Low = more factual
#         top_p=0.9,
#         top_k=50,
#         repetition_penalty=1.2
#     )

#     raw_text = output[0]["generated_text"]

#     # Extract only assistant's reply
#     if "<|assistant|>" in raw_text:
#         llm_interpretation = raw_text.split("<|assistant|>")[-1].strip()
#     else:
#         llm_interpretation = raw_text.strip()

#     # Build structured output safely
#     structured_output = {
#         "HeartRate": safe_extract(r"Heart Rate:\s*(.+)", ecg_report),
#         "Rhythm": safe_extract(r"Rhythm:\s*(.+)", ecg_report),
#         "ST_Elevation": safe_extract(r"ST Elevation:\s*(.+)", ecg_report),
#         "Diagnosis": safe_extract(r"Diagnosis:\s*(.+)", ecg_report),
#         "Confidence": safe_extract(r"Confidence:\s*(.+)", ecg_report),
#         "LLM_Interpretation": llm_interpretation
#     }

#     return structured_output




from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import re

model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

# Global variables - loaded lazily
_pipe = None
_tokenizer = None

def load_model():
    global _pipe, _tokenizer
    if _pipe is None:
        print("Loading TinyLlama model...")
        _tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            dtype=torch.float32,
        )
        _pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=_tokenizer
        )
        print("TinyLlama loaded ✅")
    return _pipe, _tokenizer


def safe_extract(pattern, text, default="N/A"):
    match = re.search(pattern, text)
    return match.group(1).strip() if match else default


def analyze_ecg(ecg_report: str) -> dict:
    pipe, tokenizer = load_model()

    messages = [
        {
            "role": "system",
            "content": "You are a cardiologist AI. Analyze ECG reports and explain findings clearly."
        },
        {
            "role": "user",
            "content": f"Analyze this ECG report and explain what it means medically:\n{ecg_report}"
        }
    ]

    formatted_prompt = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    output = pipe(
        formatted_prompt,
        max_new_tokens=300,
        do_sample=True,
        temperature=0.3,
        top_p=0.9,
        top_k=50,
        repetition_penalty=1.2
    )

    raw_text = output[0]["generated_text"]

    if "<|assistant|>" in raw_text:
        llm_interpretation = raw_text.split("<|assistant|>")[-1].strip()
    else:
        llm_interpretation = raw_text.strip()

    return {
        "HeartRate": safe_extract(r"Heart Rate:\s*(.+)", ecg_report),
        "Rhythm": safe_extract(r"Rhythm:\s*(.+)", ecg_report),
        "ST_Elevation": safe_extract(r"ST Elevation:\s*(.+)", ecg_report),
        "Diagnosis": safe_extract(r"Diagnosis:\s*(.+)", ecg_report),
        "Confidence": safe_extract(r"Confidence:\s*(.+)", ecg_report),
        "LLM_Interpretation": llm_interpretation
    }