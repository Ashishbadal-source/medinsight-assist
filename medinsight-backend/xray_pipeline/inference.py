# import onnxruntime as ort
# import numpy as np
# from PIL import Image
# import os

# LABELS = [
#     'Atelectasis', 'Cardiomegaly', 'Effusion', 'Infiltration',
#     'Mass', 'Nodule', 'Pneumonia', 'Pneumothorax', 'Consolidation',
#     'Edema', 'Emphysema', 'Fibrosis', 'Pleural_Thickening', 'Hernia'
# ]

# MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "xray_model_v3.onnx")
# session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])

# def preprocess(image_path):
#     img = Image.open(image_path).convert("RGB")
#     img = img.resize((224, 224))
#     arr = np.array(img).astype(np.float32) / 255.0
#     mean = np.array([0.485, 0.456, 0.406])
#     std  = np.array([0.229, 0.224, 0.225])
#     arr = (arr - mean) / std
#     arr = arr.transpose(2, 0, 1)  # HWC -> CHW
#     arr = np.expand_dims(arr, 0).astype(np.float32)
#     return arr

# def run_xray(image_path):
#     inp = preprocess(image_path)
#     out = session.run(None, {"input": inp})[0][0]  # shape (14,)
    
#     results = []
#     for label, score in zip(LABELS, out):
#         results.append({
#             "condition": label,
#             "probability": round(float(score) * 100, 1),
#             "detected": bool(score > 0.5)
#         })
    
#     # Sort by probability
#     results.sort(key=lambda x: x["probability"], reverse=True)
    
#     detected = [r for r in results if r["detected"]]
    
#     if not detected:
#         summary = "No significant findings detected."
#         severity = "normal"
#     elif len(detected) <= 2:
#         summary = f"{len(detected)} finding(s) detected — mild concern."
#         severity = "mild"
#     else:
#         summary = f"{len(detected)} finding(s) detected — please consult a doctor."
#         severity = "high"
    
#     return {
#         "success": True,
#         "findings": results,
#         "detected_conditions": detected,
#         "summary": summary,
#         "severity": severity,
#         "detected_count": len(detected),
#         "total_conditions": len(LABELS)
#     }










import onnxruntime as ort
import numpy as np
from PIL import Image
import os

LABELS = [
    'Atelectasis', 'Cardiomegaly', 'Effusion', 'Infiltration',
    'Mass', 'Nodule', 'Pneumonia', 'Pneumothorax', 'Consolidation',
    'Edema', 'Emphysema', 'Fibrosis', 'Pleural_Thickening', 'Hernia'
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "xray_model_v3.onnx")
session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def preprocess(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img).astype(np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406])
    std  = np.array([0.229, 0.224, 0.225])
    arr = (arr - mean) / std
    arr = arr.transpose(2, 0, 1)
    arr = np.expand_dims(arr, 0).astype(np.float32)
    return arr

def run_xray(image_path):
    inp = preprocess(image_path)
    raw = session.run(None, {"input": inp})[0][0]  # raw logits
    out = sigmoid(raw)                              # 0-1 range

    results = []
    for label, score in zip(LABELS, out):
        results.append({
            "condition": label,
            "probability": round(float(score) * 100, 1),
            "detected": bool(score > 0.6)
        })

    results.sort(key=lambda x: x["probability"], reverse=True)
    detected = [r for r in results if r["detected"]]

    if not detected:
        summary = "No significant findings detected."
        severity = "normal"
    elif len(detected) <= 2:
        summary = f"{len(detected)} finding(s) detected — mild concern."
        severity = "mild"
    else:
        summary = f"{len(detected)} finding(s) detected — please consult a doctor."
        severity = "high"

    return {
        "success": True,
        "findings": results,
        "detected_conditions": detected,
        "summary": summary,
        "severity": severity,
        "detected_count": len(detected),
        "total_conditions": len(LABELS)
    }
    