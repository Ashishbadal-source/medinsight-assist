"""
step2_rectification/rectifier.py
The main orchestration class for Step 2: Rectification.
"""
import cv2
import numpy as np
from .type_detector import detect_image_type
from .geometry_utils import fine_deskew, perspective_correction
from .content_utils import detect_calibration_pulse, smart_crop
from .image_enhancer import normalize_illumination

class ECGRectifier:
    """
    Orchestrates the 9-step rectification engine to produce a standardized ECG image.
    """
    
    TARGET_WIDTH = 2200
    TARGET_HEIGHT = 1700

    def process(self, img: np.ndarray) -> dict:
        """
        Full rectification pipeline.
        """
        try:
            # 1. Image Type Detection
            type_res = detect_image_type(img)
            img_type = type_res["image_type"]
            
            # 2. Adaptive Denoise
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            if img_type == "scan":
                denoised = cv2.medianBlur(gray, 3)
            else:
                # Bilateral preserves edges for photos
                denoised = cv2.bilateralFilter(gray, 5, 15, 15)
            
            # 3. Fine Deskew
            working_img, angle, skew_applied = fine_deskew(img, denoised)
            working_gray = cv2.cvtColor(working_img, cv2.COLOR_BGR2GRAY)
            
            # 4. Perspective Correction (Conditional)
            had_perspective = False
            if img_type != "scan":
                corrected_img, success = perspective_correction(working_img, working_gray)
                if success:
                    working_img = corrected_img
                    working_gray = cv2.cvtColor(working_img, cv2.COLOR_BGR2GRAY)
                    had_perspective = True
            
            # 5. Calibration Pulse Detection
            pulse_info = detect_calibration_pulse(working_gray)
            
            # 6. Smart Crop
            cropped = smart_crop(working_img, working_gray, pulse_info)
            
            # 7. Illumination Fix (Single Pass)
            enhanced = normalize_illumination(cropped, img_type)
            
            # 8. Standardize (Resize + White Pad)
            standardized, pad_meta = self._standardize(enhanced)
            
            # 9. Quality Scoring
            quality_info = self._calculate_quality(standardized)
            
            return {
                "image": standardized,
                "image_type": img_type,
                "skew_angle_deg": round(angle, 4),
                "skew_applied": skew_applied,
                "had_perspective": had_perspective,
                "calibration_pulse": {
                    "found": pulse_info["found"],
                    "height_px": pulse_info["height_px"]
                },
                "quality_score": quality_info["score"],
                "quality_flag": quality_info["flag"],
                "quality_breakdown": quality_info["breakdown"],
                "pad_top": pad_meta["pad_top"],
                "pad_left": pad_meta["pad_left"],
                "scale_factor": pad_meta["scale_factor"]
            }
            
        except Exception as e:
            import traceback
            return {
                "error": str(e),
                "traceback": traceback.format_exc()
            }

    def _standardize(self, img: np.ndarray) -> tuple[np.ndarray, dict]:
        h, w = img.shape[:2]
        scale = min(self.TARGET_WIDTH / w, self.TARGET_HEIGHT / h)
        
        new_w = int(w * scale)
        new_h = int(h * scale)
        
        resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
        
        # Create white canvas
        canvas = np.full((self.TARGET_HEIGHT, self.TARGET_WIDTH, 3), 255, dtype=np.uint8)
        
        # Center the image
        pad_top = (self.TARGET_HEIGHT - new_h) // 2
        pad_left = (self.TARGET_WIDTH - new_w) // 2
        
        canvas[pad_top:pad_top+new_h, pad_left:pad_left+new_w] = resized
        
        return canvas, {
            "pad_top": pad_top,
            "pad_left": pad_left,
            "scale_factor": scale
        }

    def _calculate_quality(self, img: np.ndarray) -> dict:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 1. Edge density
        edges = cv2.Canny(gray, 30, 100)
        edge_density = np.mean(edges > 0)
        # Normalize to 0..1 (typical ECG range 0.02 to 0.25)
        edge_score = float(np.clip((edge_density - 0.02) / 0.23, 0.0, 1.0))
        
        # 2. Grid/Line count
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, 40, minLineLength=80)
        line_count = len(lines) if lines is not None else 0
        grid_score = float(np.clip((line_count - 10) / 100, 0.0, 1.0))
        
        # 3. Sharpness (Laplacian variance)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness_score = float(np.clip((laplacian_var - 100) / 2900, 0.0, 1.0))
        
        # 4. Contrast (pixel std)
        pixel_std = np.std(gray)
        contrast_score = float(np.clip((pixel_std - 15) / 55, 0.0, 1.0))
        
        score = (0.30 * edge_score + 0.30 * grid_score + 
                 0.25 * sharpness_score + 0.15 * contrast_score)
        
        if score >= 0.65:
            flag = "ok"
        elif score >= 0.40:
            flag = "low_quality"
        else:
            flag = "unusable"
            
        return {
            "score": round(score, 4),
            "flag": flag,
            "breakdown": {
                "edge": round(edge_score, 4),
                "grid": round(grid_score, 4),
                "sharpness": round(sharpness_score, 4),
                "contrast": round(contrast_score, 4)
            }
        }
