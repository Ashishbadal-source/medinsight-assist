# # backend/services/ml_inference.py

# import numpy as np

# class ECGInferenceService:
#     def __init__(self):
#         self.model_loaded = False

#     def load_model(self):
#         # abhi dummy
#         self.model_loaded = True

#     def predict(self, ecg_signal):
#         # ecg_signal shape: (12,5000)
#         if ecg_signal.shape != (12, 5000):
#             raise ValueError("Invalid ECG shape")

#         # ---- DUMMY OUTPUT ----
#         confidence = 0.78
#         prediction = 1 if confidence > 0.5 else 0

#         return {
#             "prediction": prediction,
#             "confidence": confidence
#         }







import numpy as np


class ECGInferenceService:
    def __init__(self):
        self.model_loaded = False

    def load_model(self):
        # future me real model load hoga
        self.model_loaded = True

    def predict(self, ecg_signal):

        if not self.model_loaded:
            raise RuntimeError("Model not loaded")

        if ecg_signal.shape != (12, 5000):
            raise ValueError("Invalid ECG shape")

        # dummy future-like output
        confidence = 0.78
        diseases = ["Myocardial Infarction"] if confidence > 0.5 else []

        summary = "Pattern consistent with MI" if diseases else "No acute MI pattern detected"

        return {
            "predicted_diseases": diseases,
            "confidence": float(confidence),
            "summary": summary,
            "abnormal_values": {}
        }

