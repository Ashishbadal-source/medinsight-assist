# # import cv2
# # import numpy as np

# # # ================= QUALITY CHECK =================
# # from quality_check.check_quality import check_quality

# # # ================= EDGE-BASED WAVEFORM EXTRACTION =================
# # from segmentation.edge_waveform import extract_waveform_edges

# # # ================= LEAD EXTRACTION =================
# # from lead_extraction.crop_leads import crop_leads

# # # ================= SIGNAL PROCESSING =================
# # from signal_extraction.pixel_to_voltage import pixel_to_signal
# # from signal_extraction.baseline_correction import remove_baseline
# # from signal_extraction.bandpass_filter import bandpass_filter
# # from signal_extraction.denoise import median_denoise
# # from signal_extraction.normalize import normalize_signal
# # from lead_extraction.order_and_polarity import order_and_fix_ecg
# # from signal_extraction.length_normalize import normalize_length
# # from signal_extraction.median_denoise import normalize_amplitude


# # # ================= ASSEMBLY =================
# # from assemble.build_ecg_tensor import build_ecg_tensor

# # # ================= VIS =================
# # from utils.plot_ecg import plot_ecg


# # # ==================================================
# # # STEP 1: LOAD IMAGE
# # # ==================================================
# # print("STEP 1: Loading ECG image...")
# # image_path = "data/raw_images/ecg_001.png"
# # img = cv2.imread(image_path)

# # if img is None:
# #     raise ValueError("❌ Image not found or unreadable")


# # # ==================================================
# # # STEP 2: QUALITY CHECK (HARD GATE)
# # # ==================================================
# # print("STEP 2: Running quality checks...")
# # quality = check_quality(image_path)

# # if not quality["quality_pass"]:
# #     print("❌ QUALITY CHECK FAILED")
# #     print("Reasons:", quality["reasons"])
# #     exit()

# # print("✅ Quality check passed")


# # # ==================================================
# # # STEP 3: EDGE-BASED WAVEFORM EXTRACTION (🔥 KEY FIX)
# # # ==================================================
# # print("STEP 3: Extracting waveform using edge-based method...")
# # mask = extract_waveform_edges(img)

# # # if cv2.countNonZero(mask) == 0:
# # #     raise ValueError("❌ Edge-based extraction failed")
# # if cv2.countNonZero(mask) == 0:
# #     print("⚠️ Empty mask detected, continuing with raw edges")


# # print("✅ Edge waveform extraction complete")


# # # ==================================================
# # # STEP 4: EXTRACT LEADS
# # # ==================================================
# # print("STEP 4: Extracting leads...")
# # lead_masks = crop_leads(mask)

# # if len(lead_masks) == 0:
# #     raise ValueError("❌ No leads extracted")

# # print(f"✅ Extracted {len(lead_masks)} leads")


# # # ==================================================
# # # STEP 5: SIGNAL EXTRACTION & PROCESSING
# # # ==================================================
# # signals = []

# # for i in range(len(lead_masks)):
# #     print(f"STEP 5.{i+1}: Processing lead {i+1}")

# #     lead_mask = lead_masks[i]

# #     sig = pixel_to_signal(lead_mask)
# #     sig = remove_baseline(sig)
# #     sig = bandpass_filter(sig)
# #     sig = median_denoise(sig)
# #     sig = normalize_signal(sig)

# #     signals.append(sig)


# # # ==================================================
# # # STEP 6: BUILD ECG TENSOR
# # # ==================================================
# # print("STEP 6: Building ECG tensor...")
# # ecg = build_ecg_tensor(signals)
# # ecg = order_and_fix_ecg(ecg)
# # ecg = normalize_length(ecg, target_len=5000)
# # ecg = normalize_amplitude(ecg, target_mv=1.0)

# # print("✅ ECG tensor shape:", ecg.shape)

# # np.save("ecg_signal.npy", ecg)
# # print("📁 Saved → ecg_signal.npy")


# # # ==================================================
# # # STEP 7: DEBUG VISUALIZATION
# # # ==================================================
# # print("DEBUG: Non-zero pixels (EDGE mask) =", cv2.countNonZero(mask))

# # # cv2.imshow("EDGE_WAVEFORM_MASK", mask)

# # for i in range(len(lead_masks)):
# #     lead_vis = (lead_masks[i] > 0).astype("uint8") * 255
# #     # cv2.imshow(f"LEAD_{i+1}", lead_vis)

# # # cv2.waitKey(0)
# # # cv2.destroyAllWindows()

# # plot_ecg(ecg)

# # print("🎉 PIPELINE COMPLETED SUCCESSFULLY")


# # from ml.validate_input import validate_ecg

# # ok, reason = validate_ecg(ecg)

# # if not ok:
# #     raise ValueError(f"❌ ECG validation failed: {reason}")

# # print("✅ ECG input validated for ML")


# # from ml.prepare_input import prepare_ml_input

# # ml_input = prepare_ml_input(ecg)
# # print("✅ ML input ready:", ml_input.shape)
# # print(type(ecg), ecg.shape)







            
# import cv2         
# import numpy as np   
# from ecg_pipeline.quality_check.check_quality import check_quality  
# from ecg_pipeline.segmentation.edge_waveform import extract_waveform_edges
# from ecg_pipeline.lead_extraction.crop_leads import crop_leads
# from ecg_pipeline.lead_extraction.order_and_polarity import order_and_fix_ecg
# from ecg_pipeline.signal_extraction.pixel_to_voltage import pixel_to_signal
# from ecg_pipeline.signal_extraction.baseline_correction import remove_baseline
# from ecg_pipeline.signal_extraction.bandpass_filter import bandpass_filter
# from ecg_pipeline.signal_extraction.denoise import median_denoise
# from ecg_pipeline.signal_extraction.amplitude_normalize import normalize_amplitude
# from ecg_pipeline.signal_extraction.length_normalize import normalize_length
# from ecg_pipeline.assemble.build_ecg_tensor import build_ecg_tensor
# from ecg_pipeline.utils.plot_ecg import plot_ecg
# from ecg_pipeline.ml.validate_input import validate_ecg
# from ecg_pipeline.ml.prepare_input import prepare_ml_input


# print("STEP 1: Loading ECG image...")
# image_path = "data/raw_images/ecg_001.png"
# img = cv2.imread(image_path)

# if img is None:
#     raise ValueError("❌ Image not found or unreadable")

# print("STEP 2: Running quality checks...")
# quality = check_quality(image_path)

# if not quality["quality_pass"]:
#     print("❌ QUALITY CHECK FAILED")
#     print("Reasons:", quality["reasons"])
#     exit()

# print("✅ Quality check passed")


# # ================================================== 
# # STEP 3: EDGE-BASED WAVEFORM EXTRACTION
# # ================================================== 
# print("STEP 3: Extracting waveform using edge-based method...")
# mask = extract_waveform_edges(img)

# nz = cv2.countNonZero(mask)
# print("DEBUG: Non-zero pixels (EDGE mask) =", nz)

# if nz == 0:
#     raise ValueError("❌ Edge-based extraction failed")

# print("✅ Edge waveform extraction complete")


# # ================================================== 
# # STEP 4: EXTRACT LEADS
# # ================================================== 
# print("STEP 4: Extracting leads...")
# lead_masks = crop_leads(mask)

# if len(lead_masks) != 12:
#     raise ValueError(f"❌ Expected 12 leads, got {len(lead_masks)}")

# print("✅ Extracted 12 leads")


# # ================================================== 
# # STEP 5: SIGNAL EXTRACTION & PROCESSING (FINAL ORDER)
# # ================================================== 
# signals = []

# for i in range(12):
#     print(f"STEP 5.{i+1}: Processing lead {i+1}")

#     lead_mask = lead_masks[i]

#     sig = pixel_to_signal(lead_mask)
#     sig = remove_baseline(sig)
#     sig = bandpass_filter(sig)

#     # 🔥 amplitude normalize PER LEAD (ONLY ONCE)
#     sig = normalize_amplitude(sig.reshape(1, -1))[0]

#     # 🔥 light smoothing at the end
#     sig = median_denoise(sig)

#     signals.append(sig)


# # ================================================== 
# # STEP 6: BUILD ECG TENSOR
# # ================================================== 
# print("STEP 6: Building ECG tensor...")
# ecg = build_ecg_tensor(signals)

# # order leads + polarity
# ecg = order_and_fix_ecg(ecg)

# # enforce fixed length
# ecg = normalize_length(ecg, target_len=5000)

# print("✅ ECG tensor shape:", ecg.shape)

# np.save("ecg_signal.npy", ecg)
# print("📁 Saved → ecg_signal.npy")


# # ================================================== 
# # STEP 7: VISUALIZE SIGNAL (NON-BLOCKING)
# # ================================================== 
# # plot_ecg(ecg) 
# print("📈 ECG plot rendered")


# # ================================================== 
# # STEP 8: VALIDATE FOR ML
# # ================================================== 
# ok, reason = validate_ecg(ecg)

# if not ok:
#     raise ValueError(f"❌ ECG validation failed: {reason}")

# print("✅ ECG input validated for ML")


# # ================================================== 
# # STEP 9: PREPARE ML INPUT
# # ================================================== 
# ml_input = prepare_ml_input(ecg)
# print("✅ ML input ready:", ml_input.shape)
# print("TYPE:", type(ecg), "SHAPE:", ecg.shape)


# print("🎉 PIPELINE COMPLETED SUCCESSFULLY")









# import cv2 
# import numpy as np
# from ecg_pipeline.quality_check.check_quality import check_quality
# from ecg_pipeline.segmentation.edge_waveform import extract_waveform_edges
# from ecg_pipeline.lead_extraction.crop_leads import crop_leads
# from ecg_pipeline.lead_extraction.order_and_polarity import order_and_fix_ecg
# from ecg_pipeline.signal_extraction.pixel_to_voltage import pixel_to_signal
# from ecg_pipeline.signal_extraction.baseline_correction import remove_baseline
# from ecg_pipeline.signal_extraction.bandpass_filter import bandpass_filter
# from ecg_pipeline.signal_extraction.denoise import median_denoise
# from ecg_pipeline.signal_extraction.amplitude_normalize import normalize_amplitude
# from ecg_pipeline.signal_extraction.length_normalize import normalize_length
# from ecg_pipeline.assemble.build_ecg_tensor import build_ecg_tensor
# from ecg_pipeline.utils.plot_ecg import plot_ecg
# from ecg_pipeline.ml.validate_input import validate_ecg
# from ecg_pipeline.ml.prepare_input import prepare_ml_input


# def process_ecg_image(image_path):

#     print("STEP 1: Loading ECG image...")
#     img = cv2.imread(image_path)

#     if img is None:
#         raise ValueError("❌ Image not found or unreadable")

#     print("STEP 2: Running quality checks...")
#     quality = check_quality(image_path)

#     if not quality["quality_pass"]:
#         print("❌ QUALITY CHECK FAILED")
#         return {"status": "failed", "reasons": quality["reasons"]}

#     print("✅ Quality check passed")

#     print("STEP 3: Extracting waveform using edge-based method...")
#     mask = extract_waveform_edges(img)

#     nz = cv2.countNonZero(mask)
#     print("DEBUG: Non-zero pixels (EDGE mask) =", nz)

#     if nz == 0:
#         raise ValueError("❌ Edge-based extraction failed")

#     print("STEP 4: Extracting leads...")
#     lead_masks = crop_leads(mask)

#     if len(lead_masks) != 12:
#         raise ValueError(f"❌ Expected 12 leads, got {len(lead_masks)}")

#     print("✅ Extracted 12 leads")

#     signals = []

#     for i in range(12):
#         print(f"STEP 5.{i+1}: Processing lead {i+1}")

#         lead_mask = lead_masks[i]

#         sig = pixel_to_signal(lead_mask)
#         sig = remove_baseline(sig)
#         sig = bandpass_filter(sig)
#         sig = normalize_amplitude(sig.reshape(1, -1))[0]
#         sig = median_denoise(sig)

#         signals.append(sig)

#     print("STEP 6: Building ECG tensor...")
#     ecg = build_ecg_tensor(signals)

#     ecg = order_and_fix_ecg(ecg)
#     ecg = normalize_length(ecg, target_len=5000)

#     print("✅ ECG tensor shape:", ecg.shape)

#     np.save("ecg_signal.npy", ecg)
#     print("📁 Saved → ecg_signal.npy")

#     return {"status": "success", "ecg": ecg}

# if __name__ == "__main__":
#     result = process_ecg_image("data/raw_images/ecg_001.png")
#     print(result["status"])
    

# #check






import cv2
import numpy as np
import sys
import os

# ── path fix ────────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))

from quality_check.run_quality_check import run_quality_checks
from segmentation.segment_waveform import segment_waveform
from lead_extraction.crop_leads import crop_leads
from signal_extraction.skeletonize import skeletonize
from signal_extraction.pixel_to_signal import pixel_to_signal
from signal_extraction.normalize import normalize_signal
from signal_extraction.resample import resample_signal
from assemble.build_ecg_tensor import build_ecg_tensor
from ml.inference import run_inference


def run_ecg_pipeline(image_path: str) -> dict:
    """
    Full pipeline: ECG image path → diagnosis dict
    """

    # ── Step 1: Load image ───────────────────────────────────
    img = cv2.imread(image_path)
    if img is None:
        return {"success": False, "error": "Image not found or unreadable"}

    # ── Step 2: Quality check ────────────────────────────────
    passed, reason = run_quality_checks(img)
    if not passed:
        return {"success": False, "error": f"Quality check failed: {reason}"}

    # ── Step 3: Segment waveform ─────────────────────────────
    mask = segment_waveform(img)

    # ── Step 4: Crop 12 leads ────────────────────────────────
    lead_masks = crop_leads(mask)

    if len(lead_masks) < 12:
        return {
            "success": False,
            "error": f"Could not extract 12 leads, got {len(lead_masks)}"
        }

    # exactly 12 leads lo
    lead_masks = lead_masks[:12]

    # ── Step 5: Each lead → signal ───────────────────────────
    signals = []
    for i, lead_mask in enumerate(lead_masks):
        # skeletonize
        skel = skeletonize(lead_mask)

        # pixel → signal
        sig = pixel_to_signal(skel)

        # normalize
        sig = normalize_signal(sig)

        # resample to 5000
        sig = resample_signal(sig, target_len=5000)

        signals.append(sig)

    # ── Step 6: Build ECG tensor (5000, 12) ──────────────────
    ecg = build_ecg_tensor(signals)  # (12, 5000) abhi
    ecg = ecg.T                       # → (5000, 12) model ke liye

    # ── Step 7: Run ML inference ─────────────────────────────
    result = run_inference(ecg)

    return result


# ── Quick test ───────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_pipeline.py <image_path>")
        sys.exit(1)

    result = run_ecg_pipeline(sys.argv[1])
    import json
    print(json.dumps(result, indent=2))