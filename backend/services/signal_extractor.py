# backend/services/signal_extractor.py

import numpy as np

def extract_signal(image_path):
    # yahan tu apna FINAL PIPELINE call karega
    ecg = np.load("ecg_signal.npy")   # already validated
    return ecg.astype("float32")
