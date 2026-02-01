import cv2
import numpy as np

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


def process_ecg_image(image_path: str):
    """
    THE ONLY ECG SERVICE IN PROJECT
    """

    # -------- image quality --------
    quality = check_quality(image_path)
    if not quality["quality_pass"]:
        return {"status": "retry", "reason": "bad_image"}

    img = cv2.imread(image_path)
    if img is None:
        return {"status": "retry", "reason": "image_not_readable"}

    # -------- extraction --------
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
        "ecg": ecg
    }
