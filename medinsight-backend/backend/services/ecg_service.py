# import cv2
# import numpy as np

# from ecg_pipeline.quality_check.check_quality import check_quality
# from ecg_pipeline.segmentation.edge_waveform import extract_waveform_edges
# from ecg_pipeline.lead_extraction.crop_leads import crop_leads
# from ecg_pipeline.lead_extraction.order_and_polarity import order_and_fix_ecg    
# from ecg_pipeline.signal_extraction.pixel_to_voltage import pixel_to_signal
# from ecg_pipeline.signal_extraction.baseline_correction import remove_baseline
# from ecg_pipeline.signal_extraction.bandpass_filter import bandpass_filter
# from ecg_pipeline.signal_extraction.median_denoise import denoise_signal
# from ecg_pipeline.signal_extraction.length_normalize import normalize_length
# from ecg_pipeline.signal_extraction.amplitude_normalize import normalize_amplitude

# from ecg_pipeline.assemble.build_ecg_tensor import build_ecg_tensor 


# def process_ecg_image(image_path: str):
#     """
#     THE ONLY ECG SERVICE IN PROJECT
#     """

#     # -------- image quality --------
#     quality = check_quality(image_path)
#     if not quality["quality_pass"]:
#         return {"status": "retry", "reason": "bad_image"}

#     img = cv2.imread(image_path)
#     if img is None: 
#         return {"status": "retry", "reason": "image_not_readable"}

#     # -------- extraction -------- 
#     mask = extract_waveform_edges(img)
#     if cv2.countNonZero(mask) == 0:
#         return {"status": "retry", "reason": "no_waveform"}

#     lead_masks = crop_leads(mask)
#     if len(lead_masks) != 12:
#         return {"status": "retry", "reason": "lead_extraction_failed"}

#     signals = []
#     for lm in lead_masks:
#         sig = pixel_to_signal(lm)
#         sig = remove_baseline(sig)
#         sig = bandpass_filter(sig)
#         sig = denoise_signal(sig)
#         signals.append(sig)

#     ecg = build_ecg_tensor(signals)
#     ecg = order_and_fix_ecg(ecg)
#     ecg = normalize_length(ecg, 5000)
#     ecg = normalize_amplitude(ecg, 1.0)

# def ml_predict(ecg):
#     return {
#         "prediction": 1,
#         "confidence": 0.82
#     }
    
    
# def save_to_db(image_name, prediction, confidence):
#     print("DB SAVE CALLED")
#     print(image_name, prediction, confidence)


# def analyze_ecg(image_path):

#     # 1. ECG PIPELINE CALL
#     out = process_ecg_image(image_path)

#     if out["status"] != "success":
#         return out

#     ecg = out["ecg"]

#     # 2. ML
#     ml = ml_predict(ecg)
#     save_to_db(
#         image_name=os.path.basename(image_path),
#         prediction=ml["prediction"],
#         confidence=ml["confidence"]
#     )

#     # 4. FINAL RESPONSE
#     return {
#         "status": "success",
#         "prediction": ml["prediction"],
#         "confidence": ml["confidence"]
#     }
    
#     # return {
#     #     "status": "success",
#     #     "ecg": ecg
#     # }















import os
import cv2
import numpy as np

# ── Pipeline switch ───────────────────────────────────────────────────────────
from pipeline_config import ACTIVE_PIPELINE

def process_ecg_image(image_path: str) -> dict:
    """
    Main ECG processing entry point.
    Automatically uses final, new or old pipeline based on Master Switch.
    """
    if ACTIVE_PIPELINE == "final":
        return _run_final_pipeline(image_path)
    elif ACTIVE_PIPELINE == "new":
        return _run_new_pipeline(image_path)
    else:
        return _run_old_pipeline(image_path)

def _run_final_pipeline(image_path: str) -> dict:
    """Medical Grade 98% Accuracy Pipeline."""
    try:
        from final_pipeline.run_final_pipeline import MedInsightECGPipeline
        pipeline = MedInsightECGPipeline()
        result = pipeline.process(image_path)
        
        if not result["success"]:
            return {"status": "error", "reason": result.get("error")}
            
        return {
            "status": "success",
            "diagnosis": result["diagnostics"].get("findings", ["Normal"])[0],
            "confidence": result["overall_confidence"],
            "findings": result["diagnostics"].get("findings", []),
            "metadata": result["metadata"]
        }
    except Exception as e:
        return {"status": "error", "reason": str(e)}


def _run_new_pipeline(image_path: str) -> dict:
    """New Kaggle top-5 based pipeline."""
    try:
        from new_pipeline.inference import ECGPipelineManager
        pipeline = ECGPipelineManager.get_instance()

        if not pipeline.models_loaded:
            return {"status": "error",
                    "reason": "Models not loaded"}

        result = pipeline.run(image_path)
        return result

    except Exception as e:
        return {"status": "error", "reason": str(e)}


def _run_old_pipeline(image_path: str) -> dict:
    """Old OpenCV-based pipeline — fallback."""
    from ecg_pipeline.quality_check.check_quality import check_quality
    from ecg_pipeline.segmentation.edge_waveform import extract_waveform_edges
    from ecg_pipeline.lead_extraction.crop_leads import crop_leads
    from ecg_pipeline.lead_extraction.order_and_polarity import order_and_fix_ecg
    from ecg_pipeline.signal_extraction.pixel_to_voltage import pixel_to_signal
    from ecg_pipeline.signal_extraction.baseline_correction import remove_baseline
    from ecg_pipeline.signal_extraction.bandpass_filter import bandpass_filter
    from ecg_pipeline.signal_extraction.median_denoise import denoise_signal
    from ecg_pipeline.signal_extraction.length_normalize import normalize_length
    from ecg_pipeline.signal_extraction.amplitude_normalize import normalize_amplitude
    from ecg_pipeline.assemble.build_ecg_tensor import build_ecg_tensor

    # Quality check
    quality = check_quality(image_path)
    if not quality["quality_pass"]:
        return {"status": "retry", "reason": "bad_image"}

    img = cv2.imread(image_path)
    if img is None:
        return {"status": "retry", "reason": "image_not_readable"}

    # Extraction
    mask = extract_waveform_edges(img)
    if cv2.countNonZero(mask) == 0:
        return {"status": "retry", "reason": "no_waveform"}

    lead_masks = crop_leads(mask)
    if len(lead_masks) != 12:
        return {"status": "retry", "reason": "lead_extraction_failed"}

    signals = []
    for lm in lead_masks:
        sig = pixel_to_signal(lm)
        sig = remove_baseline(sig)
        sig = bandpass_filter(sig)
        sig = denoise_signal(sig)
        signals.append(sig)

    ecg = build_ecg_tensor(signals)
    ecg = order_and_fix_ecg(ecg)
    ecg = normalize_length(ecg, 5000)
    ecg = normalize_amplitude(ecg, 1.0)

    return {
        "status": "success",
        "ecg":    ecg.tolist()
    }