"""
step3_calibration/calibrator.py
Main Calibration Orchestrator (Steps 3.3 - 3.7)
"""
import numpy as np
from .grid_analyzer import detect_grid_spacing
from .pulse_engine import detect_calibration_pulse

class ECGCalibrator:
    def __init__(self):
        self.standard_speed = 25.0 # mm/sec
        self.standard_voltage = 1.0 # mV = 10mm
        
    def calibrate(self, gray: np.ndarray) -> dict:
        """
        Full Calibration Flow
        """
        # 3.1 Grid Detection
        grid_info = detect_grid_spacing(gray)
        px_per_mm_grid = grid_info["px_per_mm"]
        
        # 3.2 Pulse Detection
        pulse_info = detect_calibration_pulse(gray)
        
        # 3.3 & 3.4 Scale Calculation & Cross Validation
        px_per_mm = px_per_mm_grid
        px_per_mv = None
        consistency = 1.0
        
        if pulse_info["found"]:
            px_per_mv_pulse = pulse_info["height_px"]
            
            # Cross Validate with Grid
            if px_per_mm_grid:
                expected_pulse_h = px_per_mm_grid * 10.0
                diff = abs(px_per_mv_pulse - expected_pulse_h)
                error_margin = expected_pulse_h * 0.15 # 15% tolerance
                
                if diff < error_margin:
                    # Agreement! Use weighted average
                    px_per_mm = (px_per_mm_grid + (px_per_mv_pulse / 10.0)) / 2.0
                    px_per_mv = px_per_mv_pulse
                    consistency = 1.0
                else:
                    # Conflict! Trust the Grid (more samples) but flag it
                    px_per_mm = px_per_mm_grid
                    px_per_mv = px_per_mm * 10.0
                    consistency = 0.3
            else:
                # No grid, trust pulse
                px_per_mv = px_per_mv_pulse
                px_per_mm = px_per_mv / 10.0
                consistency = 0.6
        else:
            # No pulse, fallback to grid
            if px_per_mm:
                px_per_mv = px_per_mm * 10.0
                consistency = 0.5 # Lowered because no verification
            else:
                # Total failure
                px_per_mm = 20.0 # Blind fallback
                px_per_mv = 200.0
                consistency = 0.0

        # 3.5 Baseline Estimation
        # Combine pulse base with signal median
        baseline_y = None
        if pulse_info["found"]:
            baseline_y = float(pulse_info["base_y"])
        else:
            # Fallback: Image center or signal median (needs signal extraction context)
            baseline_y = float(gray.shape[0] / 2.0)

        # 3.6 Time Calibration (25mm/sec)
        # Each pixel = (1 / pixels_per_mm) mm. 
        # Time = mm / speed = (1/px_per_mm) / 25
        time_per_pixel = (1.0 / px_per_mm) / self.standard_speed if px_per_mm else 0.0

        # 3.7 Confidence Scoring
        total_confidence = (
            0.4 * grid_info["confidence"] +
            0.4 * pulse_info["confidence"] +
            0.2 * consistency
        )
        
        flag = "high_confidence"
        if total_confidence < 0.3: flag = "low_confidence"
        elif total_confidence < 0.6: flag = "usable"

        return {
            "pixels_per_mm": float(px_per_mm),
            "pixels_per_mV": float(px_per_mv),
            "time_per_pixel": float(time_per_pixel),
            "baseline_y": float(baseline_y),
            "pulse_detected": pulse_info["found"],
            "calibration_confidence": round(float(total_confidence), 4),
            "confidence_flag": flag,
            "grid_info": grid_info
        }
