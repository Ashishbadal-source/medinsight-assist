"""
step2_rectification/type_detector.py
Detects whether input image is a flatbed SCAN or PHONE PHOTO.
This is the most critical branch decision in Step 2:
  - Scan  → no perspective → skip 2.4
  - Photo → has perspective, uneven lighting → apply full corrections
"""
import cv2
import numpy as np


def detect_image_type(img: np.ndarray) -> dict:
    """
    3-factor vote: background uniformity, edge regularity, aspect ratio.

    Returns
    -------
    dict:
        image_type: "scan" | "photo" | "unknown"
        confidence: float 0..1
        factors: dict with per-factor scores
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if img.ndim == 3 else img.copy()
    h, w = gray.shape[:2]

    scores = {}

    # ── Factor 1: Background uniformity ──────────────────────────────────────
    # Scans have near-uniform white background (very low std of light pixels).
    # Photos have shadows, gradients → higher std.
    light_mask = gray > 200
    if light_mask.sum() > 100:
        bg_std = float(np.std(gray[light_mask]))
    else:
        bg_std = 50.0  # no clear background → treat as photo

    # bg_std < 8 → strong scan signal; > 20 → strong photo signal
    # v2: Handle perfect synthetic images (std near 0)
    if bg_std < 2.0:
        bg_score_scan = 1.0
    else:
        bg_score_scan = float(np.clip(1.0 - (bg_std - 4) / 20.0, 0.0, 1.0))
    scores["background_uniformity"] = bg_score_scan

    # ── Factor 2: Edge straightness ───────────────────────────────────────────
    # Scan: grid lines perfectly horizontal/vertical → near-zero angle std
    # Photo: all lines have a consistent tilt (camera angle) → angle std moderate
    # Photo with bad angle: lines very far from 0/90 → not scan
    edges = cv2.Canny(gray, 50, 120)
    lines = cv2.HoughLinesP(
        edges, 1, np.pi / 180,
        threshold=60,
        minLineLength=max(w, h) // 6,
        maxLineGap=15,
    )
    if lines is not None and len(lines) >= 5:
        angles = []
        for ln in lines[:, 0, :]:
            x1, y1, x2, y2 = ln
            a = abs(np.degrees(np.arctan2(y2 - y1, x2 - x1)))
            # Fold to [0, 90]
            a = a if a <= 90 else 180 - a
            # Distance from nearest axis (0 or 90)
            deviation = min(a, abs(90 - a))
            angles.append(deviation)
        mean_dev = float(np.mean(angles))
        # mean_dev < 2° → very straight lines → scan
        # mean_dev > 8° → lines tilted → photo
        edge_score_scan = float(np.clip(1.0 - (mean_dev - 1.0) / 7.0, 0.0, 1.0))
    else:
        edge_score_scan = 0.5  # uncertain
    scores["edge_straightness"] = edge_score_scan

    # ── Factor 3: Aspect ratio proximity to standard ECG paper ───────────────
    # Scanners output A4 (1.41) or Letter (1.29) exactly.
    # Phone photos can be any ratio.
    aspect = w / float(h + 1e-6)
    a4_dist    = abs(aspect - 1.414)
    letter_dist = abs(aspect - 1.294)
    min_dist = min(a4_dist, letter_dist)
    # Within 0.08 → strong scan signal
    aspect_score_scan = float(np.clip(1.0 - min_dist / 0.15, 0.0, 1.0))
    scores["aspect_ratio"] = aspect_score_scan

    # ── Weighted vote ─────────────────────────────────────────────────────────
    scan_score = (
        0.50 * bg_score_scan
        + 0.35 * edge_score_scan
        + 0.15 * aspect_score_scan
    )

    if scan_score >= 0.65:
        image_type = "scan"
    elif scan_score <= 0.35:
        image_type = "photo"
    else:
        image_type = "unknown"  # treated as photo (safer)

    return {
        "image_type":  image_type,
        "scan_score":  round(scan_score, 4),
        "factors":     {k: round(v, 4) for k, v in scores.items()},
    }
