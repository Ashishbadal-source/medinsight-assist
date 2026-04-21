# Step 1: Strict ECG Gatekeeper

This module performs one task only:

- input image -> ECG / NOT ECG decision

Output format:

```python
{
  "is_ecg": True/False,
  "confidence": 0.0..1.0
}
```

Strict acceptance rule:

- if `confidence < 0.99`, output is forced to `is_ecg=False`

## Pipeline

1. Light filter (fast reject)
2. Auto orientation + grid evidence
3. ECG validation:
   - multi-strip layout
   - QRS-like peaks in 1D projection
   - autocorrelation periodicity
   - FFT concentration in ECG-like rhythm band
4. Weighted strict decision

## Files

- `gatekeeper.py`: detector implementation
- `test_gatekeeper.py`: synthetic robustness tests
- `test_images/`: generated test artifacts at runtime

## Local run

```bash
python test_gatekeeper.py
python gatekeeper.py test_images/real_ecg_like_1.png
```
