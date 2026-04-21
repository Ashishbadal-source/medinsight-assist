from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import sys


# This wrapper provides the "ecg_detection_module" entrypoint
# while keeping all strict logic in `step1_gatekeeper/gatekeeper.py`.
_THIS_DIR = Path(__file__).resolve().parent
_FINAL_PIPELINE_DIR = _THIS_DIR.parent
_STEP1_DIR = _FINAL_PIPELINE_DIR / "step1_gatekeeper"

# Ensure local imports work even when this module is called as a script.
sys.path.insert(0, str(_STEP1_DIR))

from gatekeeper import ECGGatekeeper  # noqa: E402


@dataclass
class ECGDetectionModule:
    """
    Strict ECG detection module.

    Only responsibility:
      image -> decide is this ECG or NOT ECG
    """

    def __post_init__(self):
        self._gatekeeper = ECGGatekeeper()

    def detect(self, image_path: str) -> dict:
        res = self._gatekeeper.decide(image_path)
        return {"is_ecg": bool(res.get("is_ecg", False)), "confidence": float(res.get("confidence", 0.0))}


def detect_ecg(image_path: str) -> dict:
    """
    Convenience function returning the strict output contract.
    """
    module = ECGDetectionModule()
    return module.detect(image_path)

