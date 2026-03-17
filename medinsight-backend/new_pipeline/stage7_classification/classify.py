# new_pipeline/stage7_classification/classify.py

import numpy as np
import torch
import torch.nn as nn
from .labels import (DIAGNOSTIC_SUBCLASSES, RHYTHM_CLASSES,
                      get_severity, LEAD_ORDER)

LEAD_ORDER = ['I','II','III','aVR','aVL','aVF',
              'V1','V2','V3','V4','V5','V6']


class ECGClassifier(nn.Module):
    """
    EfficientNet-based ECG classifier.
    Input:  (B, 12, 5000) — 12-lead signal
    Output: diagnostic + rhythm predictions
    """
    def __init__(self,
                  n_diagnostic: int = 44,
                  n_rhythm: int = 23):
        super().__init__()

        # 1D signal encoder
        self.encoder = nn.Sequential(
            nn.Conv1d(12, 64,  kernel_size=15, padding=7),
            nn.BatchNorm1d(64), nn.GELU(),
            nn.Conv1d(64, 128, kernel_size=15, padding=7, stride=2),
            nn.BatchNorm1d(128), nn.GELU(),
            nn.Conv1d(128, 256, kernel_size=11, padding=5, stride=2),
            nn.BatchNorm1d(256), nn.GELU(),
            nn.Conv1d(256, 512, kernel_size=9,  padding=4, stride=2),
            nn.BatchNorm1d(512), nn.GELU(),
            nn.Conv1d(512, 512, kernel_size=9,  padding=4, stride=2),
            nn.BatchNorm1d(512), nn.GELU(),
            nn.AdaptiveAvgPool1d(1),
        )

        self.diagnostic_head = nn.Sequential(
            nn.Flatten(),
            nn.Linear(512, 256),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(256, n_diagnostic)
        )

        self.rhythm_head = nn.Sequential(
            nn.Flatten(),
            nn.Linear(512, 128),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(128, n_rhythm)
        )

    def forward(self, x):
        feat = self.encoder(x)
        return self.diagnostic_head(feat), self.rhythm_head(feat)


def load_classifier(weights_path: str,
                     device: str = 'cpu') -> ECGClassifier:
    """Load trained classifier from checkpoint."""
    model = ECGClassifier()
    ckpt  = torch.load(weights_path, map_location=device)

    # Handle different checkpoint formats
    if 'model_state_dict' in ckpt:
        model.load_state_dict(ckpt['model_state_dict'])
    else:
        model.load_state_dict(ckpt)

    model.eval()
    return model.to(device)


def classify_ecg(ecg_array: np.ndarray,
                  classifier: ECGClassifier,
                  device: str = 'cpu',
                  threshold: float = 0.5) -> dict:
    """
    Full classification pipeline.
    Input:  ecg_array (12, 5000)
    Output: complete diagnostic report dict
    """
    # Normalize input
    ecg = ecg_array.copy().astype(np.float32)
    mean = ecg.mean(axis=1, keepdims=True)
    std  = ecg.std(axis=1,  keepdims=True) + 1e-8
    ecg  = (ecg - mean) / std

    # To tensor
    x = torch.from_numpy(ecg).unsqueeze(0).to(device)  # (1, 12, 5000)

    with torch.no_grad():
        diag_logits, rhythm_logits = classifier(x)

    diag_probs   = torch.sigmoid(diag_logits)[0].cpu().numpy()
    rhythm_probs = torch.sigmoid(rhythm_logits)[0].cpu().numpy()

    # ── Diagnostic Results ────────────────────────────────────────────────────
    diag_keys  = list(DIAGNOSTIC_SUBCLASSES.keys())
    rhythm_keys = list(RHYTHM_CLASSES.keys())

    # All findings above threshold
    findings = []
    for i, (code, prob) in enumerate(zip(diag_keys, diag_probs)):
        if prob >= threshold:
            findings.append({
                'code':        code,
                'description': DIAGNOSTIC_SUBCLASSES[code],
                'confidence':  float(round(prob, 4)),
                'severity':    get_severity(code),
            })

    # Sort by confidence
    findings.sort(key=lambda x: x['confidence'], reverse=True)

    # ── Rhythm Results ────────────────────────────────────────────────────────
    rhythms = []
    for i, (code, prob) in enumerate(zip(rhythm_keys, rhythm_probs)):
        if prob >= threshold:
            rhythms.append({
                'code':        code,
                'description': RHYTHM_CLASSES[code],
                'confidence':  float(round(prob, 4)),
            })
    rhythms.sort(key=lambda x: x['confidence'], reverse=True)

    # ── Primary Diagnosis ─────────────────────────────────────────────────────
    primary = findings[0] if findings else {
        'code': 'NORM', 'description': 'Normal ECG',
        'confidence': float(round(float(diag_probs[0]), 4)),
        'severity': 'LOW'
    }

    # ── Overall Severity ──────────────────────────────────────────────────────
    severities = [f['severity'] for f in findings]
    if 'CRITICAL' in severities:
        overall_severity = 'CRITICAL'
    elif 'HIGH' in severities:
        overall_severity = 'HIGH'
    elif 'MEDIUM' in severities:
        overall_severity = 'MEDIUM'
    else:
        overall_severity = 'LOW'

    # ── Signal Quality ────────────────────────────────────────────────────────
    signal_quality = _assess_signal_quality(ecg_array)

    # ── Full Report ───────────────────────────────────────────────────────────
    return {
        'primary_diagnosis':  primary,
        'all_findings':       findings,
        'rhythm':             rhythms[0] if rhythms else None,
        'all_rhythms':        rhythms,
        'overall_severity':   overall_severity,
        'signal_quality':     signal_quality,
        'raw_scores': {
            'diagnostic': {diag_keys[i]: float(round(float(p), 4))
                           for i, p in enumerate(diag_probs)},
            'rhythm':     {rhythm_keys[i]: float(round(float(p), 4))
                           for i, p in enumerate(rhythm_probs)},
        }
    }


def _assess_signal_quality(ecg: np.ndarray) -> dict:
    """Basic signal quality assessment."""
    qualities = {}
    for i, lead in enumerate(LEAD_ORDER):
        sig  = ecg[i]
        snr  = _estimate_snr(sig)
        flat = float(np.std(sig)) < 0.01
        qualities[lead] = {
            'snr_db':    float(round(snr, 2)),
            'is_flat':   flat,
            'amplitude': float(round(float(np.ptp(sig)), 4)),
            'quality':   'GOOD' if snr > 15 and not flat else
                         'FAIR' if snr > 8  else 'POOR'
        }

    overall = sum(1 for q in qualities.values()
                  if q['quality'] == 'GOOD') / len(qualities)

    return {
        'per_lead':       qualities,
        'overall_score':  float(round(overall, 2)),
        'overall_quality': 'GOOD' if overall > 0.8 else
                           'FAIR' if overall > 0.5 else 'POOR'
    }


def _estimate_snr(signal: np.ndarray) -> float:
    """Quick SNR estimate using signal variance."""
    from scipy.signal import butter, filtfilt
    try:
        b, a     = butter(4, [0.5/250, 40/250], btype='band')
        filtered = filtfilt(b, a, signal)
        noise    = signal - filtered
        sp       = np.mean(filtered**2)
        np_      = np.mean(noise**2)
        return 10*np.log10(sp/(np_+1e-10)) if np_ > 1e-10 else 50.0
    except:
        return 20.0