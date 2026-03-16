# backend/services/ml_inference.py

import numpy as np

class ECGInferenceService:
    def __init__(self):
        self.model_loaded = False

    def load_model(self):
        # abhi dummy
        self.model_loaded = True

    def predict(self, ecg_signal):
        # ecg_signal shape: (12,5000)
        if ecg_signal.shape != (12, 5000):
            raise ValueError("Invalid ECG shape")

        # ---- DUMMY OUTPUT ----
        confidence = 0.78
        prediction = 1 if confidence > 0.5 else 0

        return {
            "prediction": prediction,
            "confidence": confidence
        }
