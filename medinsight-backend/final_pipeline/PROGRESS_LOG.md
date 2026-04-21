# Final Pipeline Progress Log

## Session: Step 1 Gatekeeper hardening

- Date: 2026-04-16
- Model used: Codex 5.3
- Scope restriction followed: only `medinsight-backend/final_pipeline/**` edited

## What was already present

- `step1_gatekeeper/gatekeeper.py` with strict ECG decision contract:
  - output: `{"is_ecg": bool, "confidence": float}`
  - strict rule: confidence must be `>= 0.99` to accept ECG
- `step1_gatekeeper/test_gatekeeper.py` with synthetic tests including:
  - ECG-like images
  - blank image
  - random noise
  - ECG grid with mod-x style graph
  - person-like image

## Changes made in this session

### [2026-04-21] — Step 2 Rectification Engine (Final++ Version)

### 🚀 Accomplishments
- **Step 1 Gatekeeper v3.1**: Fixed all critical bugs (Color grid, portrait aspect, threshold). TPR raised from 0% to 100% on synthetic tests.
- **Step 2 Rectification Engine**: Implemented from scratch with 9 sub-steps.
  - **Image Type Detection**: Scan vs Photo logic.
  - **Fine Deskew**: Sub-degree precision with weighted median.
  - **Perspective Correction**: Contour + Hough fallback.
  - **Calibration Pulse Guard**: Protects 1mV reference box.
  - **Smart Crop**: Content-aware with 2% safety margin.
  - **Quality Scoring**: Multi-factor 0..1 scale.

### 🧪 Benchmarks
- **Step 1**: 100% Accuracy, 100% Precision, 100% Recall on synthetic benchmark.
- **Step 2**: Successfully straightened 3.5° skewed images and standardized to 2200x1700.

### ⏭️ Next Steps
- Implement Step 3: Grid Calibration & Lead Segmentation.
- Integrate Gatekeeper + Rectifier into a unified pipeline runner.
 in output metrics
- Added FFT-based rhythm concentration score:
  - computes spectral power concentration in ECG-like frequency band (normalized proxy)
  - adds `fft_score` to final weighted confidence
  - stores `fft_band_concentration` in output metrics
- Rebalanced score weights to include FFT while keeping conservative behavior.

### 2) Test expansion (`step1_gatekeeper/test_gatekeeper.py`)

- Added two more real ECG-like synthetic scenarios:
  - `real_ecg_like_3.png` (different spacing/amplitude)
  - `real_ecg_like_4_tilt_blur.png` (slight tilt + blur)
- Test list now covers:
  - 4 ECG-like positive cases
  - mod-x on ECG grid negative
  - person image negative
  - blank negative
  - noise negative

## Notes for next session

- Keep all subsequent steps inside `final_pipeline` only.
- Next likely milestone: Step 2 formalization (orientation + grid reliability metrics as standalone module).
- Then Step 3 can split into pluggable validators:
  - layout validator
  - waveform validator
  - rhythm validator
  - decision combiner

## Session: External real-image validation (9 images)

- Date: 2026-04-16
- Model used: Codex 5.3
- Scope restriction followed: only `medinsight-backend/final_pipeline/**` edited

### Added/updated files in this session

- Added `step1_gatekeeper/run_external_tests.py`
  - Runs gatekeeper on 9 externally provided images
  - Saves machine-readable output to:
    - `step1_gatekeeper/external_test_results.json`
- Added `ecg_detection_module/__init__.py`
- Added `ecg_detection_module/detector.py` (strict wrapper output: `{"is_ecg","confidence"}`)
- Updated `step1_gatekeeper/gatekeeper.py`:
  - Added grid spacing estimation
  - Added QRS sharpness constraint
  - Added BPM validity gate (`30..180`) using grid-based lag-to-time conversion
- Updated `step1_gatekeeper/test_gatekeeper.py`:
  - Added more rotation cases
  - Added custom CLI `--case PATH EXPECT`

### 9-image external test outcome

- Total: 9
- Passed: 6
- Failed: 3
- Failing cases were all real ECG images:
  - `ecg_001` -> rejected by fast filter (`too_noisy`, edge_density ~0.582)
  - `ecg_5` -> rejected by fast filter (`too_noisy`, edge_density ~0.622)
  - `ecg_4` -> rejected by fast filter (`too_noisy`, edge_density ~0.395)

### Interpretation

- False positives stayed controlled (non-ECG examples rejected).
- Current strict light-filter threshold is too aggressive for dense real ECG paper grids.
- Next tuning should adjust edge-density logic for ECG-paper characteristics instead of blanket noisy rejection.

## Session: Gatekeeper tuning v2 (old vs new method update)

- Date: 2026-04-16
- Model used: Codex 5.3
- Scope restriction followed: only `medinsight-backend/final_pipeline/**` edited

### What changed in v2

- Modified `step1_gatekeeper/gatekeeper.py`:
  - Light filter changed from hard noisy reject -> soft penalty
  - Added grid spacing regularity metric (`grid_regularity`)
  - Added explicit single-graph reject (`band_count <= 1`)
  - Added minimum QRS-count gate (`qrs_count < 6` reject)
  - Fixed fast-reject behavior to only trigger on explicit reasons (e.g., `too_blank`)

### v2 external test status (same 9 images)

- Summary: 6 / 9 pass (same overall count as before)
- Positives still failing (3 ECG images), but now failure reason moved from `too_noisy` to
  weak grid validation (`v_lines=0`, `grid_present=false`) instead of early light-filter kill.
- Negatives remain rejected (blank / mod-x / single graph / person / synthetic noise).

### Interpretation after v2

- Improvement achieved: Step-1 false-negative source reduced (no more immediate noisy rejection).
- Main bottleneck now: current grid detector misses vertical evidence on real ECG scans.
- Next required upgrade: color-aware ECG paper grid extraction (red-channel grid isolation) before Hough.
