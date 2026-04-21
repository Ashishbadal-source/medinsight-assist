import argparse
import os
from pathlib import Path

import cv2
import numpy as np

from gatekeeper import ECGGatekeeper


ROOT = Path(__file__).resolve().parent
IMG_DIR = ROOT / "test_images"


def _draw_ecg_grid(canvas, small=20, major=100):
    h, w = canvas.shape[:2]
    for y in range(0, h, small):
        cv2.line(canvas, (0, y), (w, y), (205, 205, 255), 1)
    for x in range(0, w, small):
        cv2.line(canvas, (x, 0), (x, h), (205, 205, 255), 1)
    for y in range(0, h, major):
        cv2.line(canvas, (0, y), (w, y), (160, 160, 255), 2)
    for x in range(0, w, major):
        cv2.line(canvas, (x, 0), (x, h), (160, 160, 255), 2)


def _draw_ecg_strip(canvas, baseline_y, amp=35, period=180):
    w = canvas.shape[1]
    pts = []
    for x in range(20, w - 20):
        phase = (x % period) / float(period)
        y = baseline_y
        # Stylized P-QRS-T shape.
        if 0.08 < phase < 0.14:  # P
            y -= int(amp * 0.20 * np.sin((phase - 0.08) * np.pi / 0.06))
        elif 0.24 < phase < 0.27:  # Q dip
            y += int(amp * 0.30)
        elif 0.27 <= phase < 0.30:  # R spike
            y -= int(amp * 1.25)
        elif 0.30 <= phase < 0.34:  # S dip
            y += int(amp * 0.45)
        elif 0.45 < phase < 0.60:  # T
            y -= int(amp * 0.35 * np.sin((phase - 0.45) * np.pi / 0.15))
        pts.append([x, y])
    cv2.polylines(canvas, [np.array(pts, dtype=np.int32)], False, (20, 20, 20), 2)


def create_mock_images():
    IMG_DIR.mkdir(parents=True, exist_ok=True)

    # Real-ECG-like synthetic 1 (4 strips)
    ecg1 = np.full((1100, 2200, 3), 255, dtype=np.uint8)
    _draw_ecg_grid(ecg1)
    for y in (180, 430, 680, 930):
        _draw_ecg_strip(ecg1, y, amp=32, period=170)
    cv2.imwrite(str(IMG_DIR / "real_ecg_like_1.png"), ecg1)

    # Rotations (to validate strict auto-orientation logic)
    cv2.imwrite(
        str(IMG_DIR / "real_ecg_like_1_rot180.png"),
        cv2.rotate(ecg1, cv2.ROTATE_180),
    )
    cv2.imwrite(
        str(IMG_DIR / "real_ecg_like_1_rot270.png"),
        cv2.rotate(ecg1, cv2.ROTATE_90_COUNTERCLOCKWISE),
    )

    # Real-ECG-like synthetic 2 (rotated)
    ecg2 = np.full((1000, 2000, 3), 255, dtype=np.uint8)
    _draw_ecg_grid(ecg2)
    for y in (160, 380, 600, 820):
        _draw_ecg_strip(ecg2, y, amp=28, period=160)
    ecg2 = cv2.rotate(ecg2, cv2.ROTATE_90_CLOCKWISE)
    cv2.imwrite(str(IMG_DIR / "real_ecg_like_2_rotated.png"), ecg2)

    # Real-ECG-like synthetic 3 (different spacing/amplitude)
    ecg3 = np.full((1200, 2400, 3), 255, dtype=np.uint8)
    _draw_ecg_grid(ecg3, small=18, major=90)
    for y in (190, 470, 750, 1030):
        _draw_ecg_strip(ecg3, y, amp=36, period=210)
    cv2.imwrite(str(IMG_DIR / "real_ecg_like_3.png"), ecg3)

    # Real-ECG-like synthetic 4 (mild blur + slight tilt)
    ecg4 = np.full((1000, 2100, 3), 255, dtype=np.uint8)
    _draw_ecg_grid(ecg4, small=22, major=110)
    for y in (180, 380, 580, 780):
        _draw_ecg_strip(ecg4, y, amp=30, period=165)
    M = cv2.getRotationMatrix2D((ecg4.shape[1] // 2, ecg4.shape[0] // 2), 4, 1.0)
    ecg4 = cv2.warpAffine(ecg4, M, (ecg4.shape[1], ecg4.shape[0]), borderValue=(255, 255, 255))
    ecg4 = cv2.GaussianBlur(ecg4, (3, 3), 0)
    cv2.imwrite(str(IMG_DIR / "real_ecg_like_4_tilt_blur.png"), ecg4)

    # Blank image
    blank = np.full((1000, 1800, 3), 255, dtype=np.uint8)
    cv2.imwrite(str(IMG_DIR / "blank.jpg"), blank)

    # Random textured image
    noise = np.random.randint(0, 256, (1000, 1800, 3), dtype=np.uint8)
    cv2.imwrite(str(IMG_DIR / "noise.jpg"), noise)

    # ECG-like grid but wrong graph (mod-X)
    modx = np.full((1000, 1800, 3), 255, dtype=np.uint8)
    _draw_ecg_grid(modx)
    left = np.array([[x, 900 - min(x, 900)] for x in range(0, 900)], np.int32)
    right = np.array([[x, 900 - min(1800 - x, 900)] for x in range(900, 1800)], np.int32)
    cv2.polylines(modx, [left], False, (0, 0, 0), 4)
    cv2.polylines(modx, [right], False, (0, 0, 0), 4)
    cv2.imwrite(str(IMG_DIR / "mod_x_grid.jpg"), modx)

    # Person-like photo surrogate (face-style drawing)
    person = np.full((1000, 1000, 3), 230, dtype=np.uint8)
    cv2.circle(person, (500, 520), 280, (200, 190, 170), -1)
    cv2.circle(person, (420, 460), 28, (70, 70, 70), -1)
    cv2.circle(person, (580, 460), 28, (70, 70, 70), -1)
    cv2.ellipse(person, (500, 620), (100, 45), 0, 0, 180, (80, 80, 120), 6)
    cv2.imwrite(str(IMG_DIR / "person.jpg"), person)


def run_tests():
    gatekeeper = ECGGatekeeper()
    create_mock_images()

    print("Running strict ECG gatekeeper tests\n")

    tests = [
        {"name": "Real ECG-like 1", "path": IMG_DIR / "real_ecg_like_1.png", "expect": True},
        {"name": "Real ECG-like 2 Rotated", "path": IMG_DIR / "real_ecg_like_2_rotated.png", "expect": True},
        {"name": "Real ECG-like 1 Rotated 180", "path": IMG_DIR / "real_ecg_like_1_rot180.png", "expect": True},
        {"name": "Real ECG-like 1 Rotated 270", "path": IMG_DIR / "real_ecg_like_1_rot270.png", "expect": True},
        {"name": "Real ECG-like 3", "path": IMG_DIR / "real_ecg_like_3.png", "expect": True},
        {"name": "Real ECG-like 4 Tilt Blur", "path": IMG_DIR / "real_ecg_like_4_tilt_blur.png", "expect": True},
        {"name": "Fake Mod-X on ECG Grid", "path": IMG_DIR / "mod_x_grid.jpg", "expect": False},
        {"name": "Person Image", "path": IMG_DIR / "person.jpg", "expect": False},
        {"name": "Blank Paper", "path": IMG_DIR / "blank.jpg", "expect": False},
        {"name": "Random Noise", "path": IMG_DIR / "noise.jpg", "expect": False},
    ]

    all_ok = True
    for tc in tests:
        image_path = str(tc["path"])
        res = gatekeeper.decide(image_path)
        got = bool(res["is_ecg"])
        ok = got == tc["expect"]
        all_ok = all_ok and ok
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] {tc['name']}")
        print(f"  expected={tc['expect']} got={got} confidence={res['confidence']}")
        print(f"  details={res.get('breakdown', res.get('reason', res.get('error', 'n/a')))}\n")

    print("Overall:", "PASS" if all_ok else "FAIL")
    return all_ok


def run_custom_cases(case_pairs):
    """
    case_pairs: list of [path, expect] where expect is 0/1/true/false.
    """
    gatekeeper = ECGGatekeeper()
    all_ok = True

    def _to_bool(v: str) -> bool:
        v = str(v).strip().lower()
        if v in ("1", "true", "t", "yes", "y", "pass"):
            return True
        if v in ("0", "false", "f", "no", "n", "fail"):
            return False
        raise ValueError(f"Invalid expect value: {v}")

    print("\nRunning custom cases\n")
    for path, expect in case_pairs:
        exp = _to_bool(expect)
        image_path = str(path)
        res = gatekeeper.decide(image_path)
        got = bool(res["is_ecg"])
        ok = got == exp
        all_ok = all_ok and ok
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] {Path(image_path).name} (expected={exp})")
        print(f"  got={got} confidence={res.get('confidence', 'n/a')}")
        print(f"  details={res.get('breakdown', res.get('reason', res.get('error', 'n/a')))}\n")

    print("Custom Overall:", "PASS" if all_ok else "FAIL")
    return all_ok


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Strict ECG gatekeeper tests")
    parser.add_argument(
        "--case",
        nargs=2,
        action="append",
        metavar=("PATH", "EXPECT"),
        help="Add a custom test case. EXPECT should be 1/0 (or true/false).",
    )
    args = parser.parse_args()

    ok = run_tests()
    if args.case:
        ok = ok and run_custom_cases(args.case)

    raise SystemExit(0 if ok else 1)
