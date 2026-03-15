from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import re

model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

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