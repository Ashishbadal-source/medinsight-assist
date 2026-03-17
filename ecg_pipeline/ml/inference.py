# # import numpy as np
# # import keras
# # from ml.prepare_input import prepare_ml_input
# # from ml.validate_input import validate_ecg

# # # SCP codes mapping — model ke output classes
# # SCP_LABELS = {
# #     0: {"primary": "NORM", "description": "Normal ECG"},
# #     1: {"primary": "MI", "description": "Myocardial Infarction"},
# #     2: {"primary": "STTC", "description": "ST/T Change"},
# #     3: {"primary": "CD", "description": "Conduction Disturbance"},
# #     4: {"primary": "HYP", "description": "Hypertrophy"},
# # }

# # # Model ek baar load ho — har request pe nahi
# # _model = None

# # def get_model():
# #     global _model
# #     if _model is None:
# #         _model = keras.models.load_model(
# #             "ecg_pipeline/ml/models/epoch_034_valLoss_0.1221.keras"
# #         )
# #     return _model


# # def run_inference(ecg: np.ndarray) -> dict:
# #     """
# #     ecg: numpy array (12, 5000)
# #     returns: dict with primary code, description, confidence
# #     """

# #     # Step 1: Validate
# #     is_valid, reason = validate_ecg(ecg)
# #     if not is_valid:
# #         return {
# #             "success": False,
# #             "error": reason
# #         }

# #     # Step 2: Prepare input
# #     x = prepare_ml_input(ecg)  # (1, 12, 5000)

# #     # Step 3: Predict
# #     model = get_model()
# #     predictions = model.predict(x)  # shape: (1, num_classes)

# #     # Step 4: Parse output
# #     pred = predictions[0]  # (num_classes,)
# #     class_idx = int(np.argmax(pred))
# #     confidence = float(np.max(pred)) * 100

# #     label = SCP_LABELS.get(class_idx, {
# #         "primary": "UNKNOWN",
# #         "description": "Unrecognized pattern"
# #     })

# #     return {
# #         "success": True,
# #         "primary_code": label["primary"],
# #         "description": label["description"],
# #         "confidence": round(confidence, 2),
# #         "all_scores": {
# #             SCP_LABELS[i]["primary"]: round(float(pred[i]) * 100, 2)
# #             for i in range(len(pred))
# #         }
# #     }








# import numpy as np
# import keras

# # ── Label maps ──────────────────────────────────────────────
# SUBCLASS_LABELS = {
#     0: "AMI", 1: "CLBBB", 2: "CRBBB", 3: "ILBBB", 4: "IMI",
#     5: "IRBBB", 6: "ISCA", 7: "ISCI", 8: "ISC_", 9: "IVCD",
#     10: "LAFB/LPFB", 11: "LAO/LAE", 12: "LMI", 13: "LVH",
#     14: "NORM", 15: "NST_", 16: "PMI", 17: "RAO/RAE",
#     18: "RVH", 19: "SEHYP", 20: "STTC", 21: "WPW", 22: "_AVB"
# }

# SCP_LABELS = {
#     0: "1AVB", 1: "2AVB", 2: "3AVB", 3: "ALMI", 4: "AMI",
#     5: "ANEUR", 6: "ASMI", 7: "CLBBB", 8: "CRBBB", 9: "DIG",
#     10: "EL", 11: "ILBBB", 12: "ILMI", 13: "IMI", 14: "INJAL",
#     15: "INJAS", 16: "INJIL", 17: "INJIN", 18: "INJLA", 19: "IPLMI",
#     20: "IPMI", 21: "IRBBB", 22: "ISCAL", 23: "ISCAN", 24: "ISCAS",
#     25: "ISCIL", 26: "ISCIN", 27: "ISCLA", 28: "ISC_", 29: "IVCD",
#     30: "LAFB", 31: "LAO/LAE", 32: "LMI", 33: "LNGQT", 34: "LPFB",
#     35: "LVH", 36: "NDT", 37: "NORM", 38: "NST_", 39: "PMI",
#     40: "RAO/RAE", 41: "RVH", 42: "SEHYP", 43: "WPW"
# }

# # SCP code → human readable interpretation
# SCP_INTERPRETATIONS = {
#     "AMI": "Anterior myocardial infarction",
#     "IMI": "Inferior myocardial infarction",
#     "LMI": "Lateral myocardial infarction",
#     "ALMI": "Anterolateral myocardial infarction",
#     "ASMI": "Anteroseptal myocardial infarction",
#     "ILMI": "Inferolateral myocardial infarction",
#     "IPMI": "Inferoposterior myocardial infarction",
#     "IPLMI": "Inferoposterolateral myocardial infarction",
#     "PMI": "Posterior myocardial infarction",
#     "CLBBB": "Complete left bundle branch block",
#     "CRBBB": "Complete right bundle branch block",
#     "ILBBB": "Incomplete left bundle branch block",
#     "IRBBB": "Incomplete right bundle branch block",
#     "IVCD": "Intraventricular conduction delay",
#     "LAFB": "Left anterior fascicular block",
#     "LPFB": "Left posterior fascicular block",
#     "WPW": "Wolff-Parkinson-White syndrome",
#     "1AVB": "First degree AV block",
#     "2AVB": "Second degree AV block",
#     "3AVB": "Third degree AV block",
#     "LVH": "Left ventricular hypertrophy",
#     "RVH": "Right ventricular hypertrophy",
#     "SEHYP": "Septal hypertrophy",
#     "LAO/LAE": "Left atrial overload/enlargement",
#     "RAO/RAE": "Right atrial overload/enlargement",
#     "ISCAL": "Ischemia anterolateral",
#     "ISCAN": "Ischemia anterior",
#     "ISCAS": "Ischemia anteroseptal",
#     "ISCIL": "Ischemia inferolateral",
#     "ISCIN": "Ischemia inferior",
#     "ISCLA": "Ischemia lateral",
#     "ISC_": "Non-specific ischemia",
#     "ISCA": "Ischemia anterior",
#     "ISCI": "Ischemia inferior",
#     "NST_": "Non-specific ST changes",
#     "NDT": "Non-diagnostic T-wave abnormality",
#     "NORM": "Normal ECG",
#     "LNGQT": "Long QT interval",
#     "ANEUR": "ST elevation due to ventricular aneurysm",
#     "DIG": "Digitalis effect",
#     "EL": "Electrolyte disturbance",
#     "INJAL": "Injury anterolateral",
#     "INJAS": "Injury anteroseptal",
#     "INJIL": "Injury inferolateral",
#     "INJIN": "Injury inferior",
#     "INJLA": "Injury lateral",
# }

# # ── Model singleton ──────────────────────────────────────────
# _model = None

# def get_model():
#     global _model
#     if _model is None:
#         import os
#         model_path = os.path.join(
#             os.path.dirname(__file__),
#             "models", "epoch_034_valLoss_0.1221.keras"
#         )
#         _model = keras.models.load_model(model_path)
#     return _model


# # ── Main inference ───────────────────────────────────────────
# def run_inference(ecg: np.ndarray) -> dict:
#     """
#     ecg: numpy (5000, 12)
#     returns: full diagnosis dict
#     """
#     from ml.validate_input import validate_ecg
#     from ml.prepare_input import prepare_ml_input

#     # Step 1: transpose to (12, 5000) for validate
#     ecg_t = ecg.T  # (12, 5000)

#     is_valid, reason = validate_ecg(ecg_t)
#     if not is_valid:
#         return {"success": False, "error": reason}

#     # Step 2: prepare input — model expects (1, 5000, 12)
#     x = prepare_ml_input(ecg)  # (1, 5000, 12)

#     # Step 3: predict
#     model = get_model()
#     outputs = model.predict(x)

#     # Step 4: parse — 2 output heads
#     subclass_preds = outputs[0][0]   # (23,)
#     scp_preds      = outputs[1][0]   # (44,)

#     # Subclass — top prediction
#     subclass_idx  = int(np.argmax(subclass_preds))
#     subclass_conf = float(np.max(subclass_preds))
#     subclass_label = SUBCLASS_LABELS.get(subclass_idx, "UNKNOWN")

#     # SCP findings — all above threshold 0.3
#     scp_findings = []
#     for i, score in enumerate(scp_preds):
#         if score >= 0.3:
#             code = SCP_LABELS.get(i, "UNKNOWN")
#             scp_findings.append({
#                 "code": code,
#                 "confidence": round(float(score), 3),
#                 "interpretation": SCP_INTERPRETATIONS.get(code, code)
#             })

#     # Sort by confidence descending
#     scp_findings.sort(key=lambda x: x["confidence"], reverse=True)

#     # Step 5: build interpretation summary
#     interpretation = _build_interpretation(subclass_label, scp_findings)

#     return {
#         "success": True,
#         "subclass_prediction": {
#             "label": subclass_label,
#             "confidence": round(subclass_conf, 3)
#         },
#         "scp_findings": scp_findings,
#         "interpretation": interpretation
#     }


# def _build_interpretation(subclass: str, findings: list) -> dict:
#     result = {}

#     codes = [f["code"] for f in findings]

#     # Rhythm
#     if subclass == "NORM":
#         result["rhythm"] = "Normal sinus rhythm"
#     elif subclass == "WPW":
#         result["rhythm"] = "Pre-excitation pattern (WPW)"
#     elif any(c in codes for c in ["1AVB", "2AVB", "3AVB", "_AVB"]):
#         result["rhythm"] = "AV conduction abnormality"
#     else:
#         result["rhythm"] = "Sinus rhythm"

#     # Conduction
#     conduction_codes = ["CLBBB", "CRBBB", "ILBBB", "IRBBB", "IVCD", "LAFB", "LPFB"]
#     found_conduction = [SCP_INTERPRETATIONS[c] for c in codes if c in conduction_codes]
#     if found_conduction:
#         result["conduction"] = ", ".join(found_conduction)

#     # Ischemia
#     ischemia_codes = ["ISCAL", "ISCAN", "ISCAS", "ISCIL", "ISCIN", "ISCLA", "ISC_", "ISCA", "ISCI"]
#     found_ischemia = [SCP_INTERPRETATIONS[c] for c in codes if c in ischemia_codes]
#     if found_ischemia:
#         result["ischemia"] = ", ".join(found_ischemia)

#     # Hypertrophy
#     hyp_codes = ["LVH", "RVH", "SEHYP", "LAO/LAE", "RAO/RAE"]
#     found_hyp = [SCP_INTERPRETATIONS[c] for c in codes if c in hyp_codes]
#     if found_hyp:
#         result["hypertrophy"] = ", ".join(found_hyp)

#     # Final diagnosis
#     result["final_diagnosis"] = SCP_INTERPRETATIONS.get(subclass, f"ECG pattern: {subclass}")

#     return result


















# import numpy as np
# import os

# # ── Label maps ────────────────────────────────────────────
# SUBCLASS_LABELS = {
#     0: "AMI", 1: "CLBBB", 2: "CRBBB", 3: "ILBBB", 4: "IMI",
#     5: "IRBBB", 6: "ISCA", 7: "ISCI", 8: "ISC_", 9: "IVCD",
#     10: "LAFB/LPFB", 11: "LAO/LAE", 12: "LMI", 13: "LVH",
#     14: "NORM", 15: "NST_", 16: "PMI", 17: "RAO/RAE",
#     18: "RVH", 19: "SEHYP", 20: "STTC", 21: "WPW", 22: "_AVB"
# }

# SCP_LABELS = {
#     0: "1AVB", 1: "2AVB", 2: "3AVB", 3: "ALMI", 4: "AMI",
#     5: "ANEUR", 6: "ASMI", 7: "CLBBB", 8: "CRBBB", 9: "DIG",
#     10: "EL", 11: "ILBBB", 12: "ILMI", 13: "IMI", 14: "INJAL",
#     15: "INJAS", 16: "INJIL", 17: "INJIN", 18: "INJLA", 19: "IPLMI",
#     20: "IPMI", 21: "IRBBB", 22: "ISCAL", 23: "ISCAN", 24: "ISCAS",
#     25: "ISCIL", 26: "ISCIN", 27: "ISCLA", 28: "ISC_", 29: "IVCD",
#     30: "LAFB", 31: "LAO/LAE", 32: "LMI", 33: "LNGQT", 34: "LPFB",
#     35: "LVH", 36: "NDT", 37: "NORM", 38: "NST_", 39: "PMI",
#     40: "RAO/RAE", 41: "RVH", 42: "SEHYP", 43: "WPW"
# }

# SCP_INTERPRETATIONS = {
#     "AMI": "Anterior myocardial infarction",
#     "IMI": "Inferior myocardial infarction",
#     "LMI": "Lateral myocardial infarction",
#     "ALMI": "Anterolateral myocardial infarction",
#     "ASMI": "Anteroseptal myocardial infarction",
#     "ILMI": "Inferolateral myocardial infarction",
#     "IPMI": "Inferoposterior myocardial infarction",
#     "IPLMI": "Inferoposterolateral myocardial infarction",
#     "PMI": "Posterior myocardial infarction",
#     "CLBBB": "Complete left bundle branch block",
#     "CRBBB": "Complete right bundle branch block",
#     "ILBBB": "Incomplete left bundle branch block",
#     "IRBBB": "Incomplete right bundle branch block",
#     "IVCD": "Intraventricular conduction delay",
#     "LAFB": "Left anterior fascicular block",
#     "LPFB": "Left posterior fascicular block",
#     "WPW": "Wolff-Parkinson-White syndrome",
#     "1AVB": "First degree AV block",
#     "2AVB": "Second degree AV block",
#     "3AVB": "Third degree AV block",
#     "LVH": "Left ventricular hypertrophy",
#     "RVH": "Right ventricular hypertrophy",
#     "SEHYP": "Septal hypertrophy",
#     "LAO/LAE": "Left atrial overload/enlargement",
#     "RAO/RAE": "Right atrial overload/enlargement",
#     "ISCAL": "Ischemia anterolateral",
#     "ISCAN": "Ischemia anterior",
#     "ISCAS": "Ischemia anteroseptal",
#     "ISCIL": "Ischemia inferolateral",
#     "ISCIN": "Ischemia inferior",
#     "ISCLA": "Ischemia lateral",
#     "ISC_": "Non-specific ischemia",
#     "ISCA": "Ischemia anterior",
#     "ISCI": "Ischemia inferior",
#     "NST_": "Non-specific ST changes",
#     "NDT": "Non-diagnostic T-wave abnormality",
#     "NORM": "Normal ECG",
#     "LNGQT": "Long QT interval",
#     "ANEUR": "ST elevation due to ventricular aneurysm",
#     "DIG": "Digitalis effect",
#     "EL": "Electrolyte disturbance",
#     "INJAL": "Injury anterolateral",
#     "INJAS": "Injury anteroseptal",
#     "INJIL": "Injury inferolateral",
#     "INJIN": "Injury inferior",
#     "INJLA": "Injury lateral",
# }

# # ── TFLite interpreter singleton ──────────────────────────
# _interpreter = None

# def get_interpreter():
#     global _interpreter
#     if _interpreter is None:
#         import tensorflow as tf
#         model_path = os.path.join(
#             os.path.dirname(__file__),
#             "models", "ecg_model.tflite"
#         )
#         _interpreter = tf.lite.Interpreter(model_path=model_path)
#         _interpreter.allocate_tensors()
#     return _interpreter


# # ── Main inference ────────────────────────────────────────
# def run_inference(ecg: np.ndarray) -> dict:
#     """
#     ecg: numpy (5000, 12)
#     returns: full diagnosis dict
#     """
#     from ml.validate_input import validate_ecg
#     from ml.prepare_input import prepare_ml_input

#     # Step 1: validate
#     ecg_t = ecg.T  # (12, 5000)
#     is_valid, reason = validate_ecg(ecg_t)
#     if not is_valid:
#         return {"success": False, "error": reason}

#     # Step 2: prepare input (1, 5000, 12)
#     x = prepare_ml_input(ecg).astype(np.float32)

#     # Step 3: TFLite predict
#     interpreter = get_interpreter()
#     input_details = interpreter.get_input_details()
#     output_details = interpreter.get_output_details()

#     interpreter.set_tensor(input_details[0]['index'], x)
#     interpreter.invoke()

#     scp_preds = interpreter.get_tensor(output_details[0]['index'])[0]       # (44,)
#     subclass_preds = interpreter.get_tensor(output_details[1]['index'])[0]  # (23,)

#     # Step 4: parse subclass
#     subclass_idx = int(np.argmax(subclass_preds))
#     subclass_conf = float(np.max(subclass_preds))
#     subclass_label = SUBCLASS_LABELS.get(subclass_idx, "UNKNOWN")

#     # Step 5: SCP findings above threshold
#     scp_findings = []
#     for i, score in enumerate(scp_preds):
#         if score >= 0.3:
#             code = SCP_LABELS.get(i, "UNKNOWN")
#             scp_findings.append({
#                 "code": code,
#                 "confidence": round(float(score), 3),
#                 "interpretation": SCP_INTERPRETATIONS.get(code, code)
#             })
#     scp_findings.sort(key=lambda x: x["confidence"], reverse=True)

#     # Step 6: interpretation
#     interpretation = _build_interpretation(subclass_label, scp_findings)

#     return {
#         "success": True,
#         "subclass_prediction": {
#             "label": subclass_label,
#             "confidence": round(subclass_conf, 3)
#         },
#         "scp_findings": scp_findings,
#         "interpretation": interpretation
#     }


# def _build_interpretation(subclass: str, findings: list) -> dict:
#     result = {}
#     codes = [f["code"] for f in findings]

#     if subclass == "NORM":
#         result["rhythm"] = "Normal sinus rhythm"
#     elif subclass == "WPW":
#         result["rhythm"] = "Pre-excitation pattern (WPW)"
#     elif any(c in codes for c in ["1AVB", "2AVB", "3AVB", "_AVB"]):
#         result["rhythm"] = "AV conduction abnormality"
#     else:
#         result["rhythm"] = "Sinus rhythm"

#     conduction_codes = ["CLBBB", "CRBBB", "ILBBB", "IRBBB", "IVCD", "LAFB", "LPFB"]
#     found_conduction = [SCP_INTERPRETATIONS[c] for c in codes if c in conduction_codes]
#     if found_conduction:
#         result["conduction"] = ", ".join(found_conduction)

#     ischemia_codes = ["ISCAL", "ISCAN", "ISCAS", "ISCIL", "ISCIN", "ISCLA", "ISC_", "ISCA", "ISCI"]
#     found_ischemia = [SCP_INTERPRETATIONS[c] for c in codes if c in ischemia_codes]
#     if found_ischemia:
#         result["ischemia"] = ", ".join(found_ischemia)

#     hyp_codes = ["LVH", "RVH", "SEHYP", "LAO/LAE", "RAO/RAE"]
#     found_hyp = [SCP_INTERPRETATIONS[c] for c in codes if c in hyp_codes]
#     if found_hyp:
#         result["hypertrophy"] = ", ".join(found_hyp)

#     result["final_diagnosis"] = SCP_INTERPRETATIONS.get(subclass, f"ECG pattern: {subclass}")

#     return result











import numpy as np
import os

# ── Label maps ────────────────────────────────────────────
SUBCLASS_LABELS = {
    0: "AMI", 1: "CLBBB", 2: "CRBBB", 3: "ILBBB", 4: "IMI",
    5: "IRBBB", 6: "ISCA", 7: "ISCI", 8: "ISC_", 9: "IVCD",
    10: "LAFB/LPFB", 11: "LAO/LAE", 12: "LMI", 13: "LVH",
    14: "NORM", 15: "NST_", 16: "PMI", 17: "RAO/RAE",
    18: "RVH", 19: "SEHYP", 20: "STTC", 21: "WPW", 22: "_AVB"
}

SCP_LABELS = {
    0: "1AVB", 1: "2AVB", 2: "3AVB", 3: "ALMI", 4: "AMI",
    5: "ANEUR", 6: "ASMI", 7: "CLBBB", 8: "CRBBB", 9: "DIG",
    10: "EL", 11: "ILBBB", 12: "ILMI", 13: "IMI", 14: "INJAL",
    15: "INJAS", 16: "INJIL", 17: "INJIN", 18: "INJLA", 19: "IPLMI",
    20: "IPMI", 21: "IRBBB", 22: "ISCAL", 23: "ISCAN", 24: "ISCAS",
    25: "ISCIL", 26: "ISCIN", 27: "ISCLA", 28: "ISC_", 29: "IVCD",
    30: "LAFB", 31: "LAO/LAE", 32: "LMI", 33: "LNGQT", 34: "LPFB",
    35: "LVH", 36: "NDT", 37: "NORM", 38: "NST_", 39: "PMI",
    40: "RAO/RAE", 41: "RVH", 42: "SEHYP", 43: "WPW"
}

SCP_INTERPRETATIONS = {
    "AMI": "Anterior myocardial infarction",
    "IMI": "Inferior myocardial infarction",
    "LMI": "Lateral myocardial infarction",
    "ALMI": "Anterolateral myocardial infarction",
    "ASMI": "Anteroseptal myocardial infarction",
    "ILMI": "Inferolateral myocardial infarction",
    "IPMI": "Inferoposterior myocardial infarction",
    "IPLMI": "Inferoposterolateral myocardial infarction",
    "PMI": "Posterior myocardial infarction",
    "CLBBB": "Complete left bundle branch block",
    "CRBBB": "Complete right bundle branch block",
    "ILBBB": "Incomplete left bundle branch block",
    "IRBBB": "Incomplete right bundle branch block",
    "IVCD": "Intraventricular conduction delay",
    "LAFB": "Left anterior fascicular block",
    "LPFB": "Left posterior fascicular block",
    "WPW": "Wolff-Parkinson-White syndrome",
    "1AVB": "First degree AV block",
    "2AVB": "Second degree AV block",
    "3AVB": "Third degree AV block",
    "LVH": "Left ventricular hypertrophy",
    "RVH": "Right ventricular hypertrophy",
    "SEHYP": "Septal hypertrophy",
    "LAO/LAE": "Left atrial overload/enlargement",
    "RAO/RAE": "Right atrial overload/enlargement",
    "ISCAL": "Ischemia anterolateral",
    "ISCAN": "Ischemia anterior",
    "ISCAS": "Ischemia anteroseptal",
    "ISCIL": "Ischemia inferolateral",
    "ISCIN": "Ischemia inferior",
    "ISCLA": "Ischemia lateral",
    "ISC_": "Non-specific ischemia",
    "ISCA": "Ischemia anterior",
    "ISCI": "Ischemia inferior",
    "NST_": "Non-specific ST changes",
    "NDT": "Non-diagnostic T-wave abnormality",
    "NORM": "Normal ECG",
    "LNGQT": "Long QT interval",
    "ANEUR": "ST elevation due to ventricular aneurysm",
    "DIG": "Digitalis effect",
    "EL": "Electrolyte disturbance",
    "INJAL": "Injury anterolateral",
    "INJAS": "Injury anteroseptal",
    "INJIL": "Injury inferolateral",
    "INJIN": "Injury inferior",
    "INJLA": "Injury lateral",
}

# ── Keras model singleton ──────────────────────────
_model = None

def get_model():
    global _model
    if _model is None:
        import keras
        model_path = os.path.join(
            os.path.dirname(__file__),
            "models", "epoch_034_valLoss_0.1221.keras"
        )
        _model = keras.models.load_model(model_path)
    return _model


# ── Main inference ────────────────────────────────────────
def run_inference(ecg: np.ndarray) -> dict:
    from ml.validate_input import validate_ecg
    from ml.prepare_input import prepare_ml_input

    ecg_t = ecg.T  # (12, 5000)
    is_valid, reason = validate_ecg(ecg_t)
    if not is_valid:
        return {"success": False, "error": reason}

    x = prepare_ml_input(ecg).astype(np.float32)  # (1, 5000, 12)

    model = get_model()
    preds = model.predict(x, verbose=0)

    # preds[0] = subclass (23,), preds[1] = scp (44,)
    subclass_preds = preds[0][0]
    scp_preds = preds[1][0]

    subclass_idx = int(np.argmax(subclass_preds))
    subclass_conf = float(np.max(subclass_preds))
    subclass_label = SUBCLASS_LABELS.get(subclass_idx, "UNKNOWN")

    scp_findings = []
    for i, score in enumerate(scp_preds):
        if score >= 0.3:
            code = SCP_LABELS.get(i, "UNKNOWN")
            scp_findings.append({
                "code": code,
                "confidence": round(float(score), 3),
                "interpretation": SCP_INTERPRETATIONS.get(code, code)
            })
    scp_findings.sort(key=lambda x: x["confidence"], reverse=True)

    interpretation = _build_interpretation(subclass_label, scp_findings)

    return {
        "success": True,
        "subclass_prediction": {
            "label": subclass_label,
            "confidence": round(subclass_conf, 3)
        },
        "scp_findings": scp_findings,
        "interpretation": interpretation
    }


def _build_interpretation(subclass: str, findings: list) -> dict:
    result = {}
    codes = [f["code"] for f in findings]

    if subclass == "NORM":
        result["rhythm"] = "Normal sinus rhythm"
    elif subclass == "WPW":
        result["rhythm"] = "Pre-excitation pattern (WPW)"
    elif any(c in codes for c in ["1AVB", "2AVB", "3AVB", "_AVB"]):
        result["rhythm"] = "AV conduction abnormality"
    else:
        result["rhythm"] = "Sinus rhythm"

    conduction_codes = ["CLBBB", "CRBBB", "ILBBB", "IRBBB", "IVCD", "LAFB", "LPFB"]
    found_conduction = [SCP_INTERPRETATIONS[c] for c in codes if c in conduction_codes]
    if found_conduction:
        result["conduction"] = ", ".join(found_conduction)

    ischemia_codes = ["ISCAL", "ISCAN", "ISCAS", "ISCIL", "ISCIN", "ISCLA", "ISC_", "ISCA", "ISCI"]
    found_ischemia = [SCP_INTERPRETATIONS[c] for c in codes if c in ischemia_codes]
    if found_ischemia:
        result["ischemia"] = ", ".join(found_ischemia)

    hyp_codes = ["LVH", "RVH", "SEHYP", "LAO/LAE", "RAO/RAE"]
    found_hyp = [SCP_INTERPRETATIONS[c] for c in codes if c in hyp_codes]
    if found_hyp:
        result["hypertrophy"] = ", ".join(found_hyp)

    result["final_diagnosis"] = SCP_INTERPRETATIONS.get(subclass, f"ECG pattern: {subclass}")

    return result