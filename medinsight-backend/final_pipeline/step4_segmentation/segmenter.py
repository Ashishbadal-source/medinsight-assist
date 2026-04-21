"""
step4_segmentation/segmenter.py
Main Lead Segmentation Engine (Steps 4.4 - 4.8)
"""
import numpy as np
import cv2
from .layout_engine import detect_layout_family
from .gutter_detector import get_3x4_grid

class ECGSegmenter:
    def __init__(self):
        # Clinical Mapping (Step 4.5)
        self.map_3x4 = [
            ["I", "aVR", "V1", "V4"],
            ["II", "aVL", "V2", "V5"],
            ["III", "aVF", "V3", "V6"]
        ]
        
    def segment(self, gray: np.ndarray) -> dict:
        """
        Full Segmentation Flow
        """
        # 1. Detect Layout
        layout_info = detect_layout_family(gray)
        layout_type = layout_info["layout_type"]
        
        if layout_type not in ["3x4", "3x4_plus_1"]:
            # Fallback to 3x4 if unknown for now (most common)
            layout_type = "3x4_plus_1"
            
        # Clinical Safety: Always check for rhythm on 3x4
        check_rhythm = True if "3x4" in layout_type else layout_info["has_rhythm"]
        
        # 2. Find Boundaries
        rows, cols = get_3x4_grid(gray, has_rhythm=check_rhythm)
        
        # 3. Extract Panels (Step 4.4 & 4.5)
        leads = []
        rhythm_strip = None
        
        # We expect 3 rows for leads. If there's a 4th, it's the rhythm lead.
        main_rows = rows[:4] # [0, r1, r2, r3]
        if len(rows) > 4:
            rhythm_y1, rhythm_y2 = rows[3], rows[-1]
            rhythm_strip = {
                "name": "II_long",
                "crop_box": [0, int(rhythm_y1), int(gray.shape[1]), int(rhythm_y2 - rhythm_y1)],
                "quality": 0.9
            }

        # Step 4.4: Panel Extraction with padding
        h, w = gray.shape
        y_pad = int(h * 0.01)
        x_pad = int(w * 0.01)

        for r_idx in range(len(main_rows) - 1):
            y1, y2 = main_rows[r_idx], main_rows[r_idx+1]
            
            # Map columns (expecting 4 columns for 3x4)
            num_cols = len(cols) - 1
            for c_idx in range(min(num_cols, 4)):
                x1, x2 = cols[c_idx], cols[c_idx+1]
                
                # Apply padding safely
                cy1 = max(0, y1 - y_pad)
                cy2 = min(h, y2 + y_pad)
                cx1 = max(0, x1 - x_pad)
                cx2 = min(w, x2 + x_pad)
                
                lead_name = self.map_3x4[r_idx][c_idx] if r_idx < 3 and c_idx < 4 else "unknown"
                
                # Step 4.7: Quality Check (Simple Signal Density)
                panel = gray[int(y1):int(y2), int(x1):int(x2)]
                density = np.mean(255 - panel) / 255.0
                quality = 0.9 if 0.01 < density < 0.2 else 0.4
                
                leads.append({
                    "name": lead_name,
                    "crop_box": [int(cx1), int(cy1), int(cx2 - cx1), int(cy2 - cy1)],
                    "quality": float(quality)
                })

        # 4.8 Final Confidence
        seg_confidence = 0.95 if len(leads) >= 12 else 0.5

        return {
            "layout_type": layout_type,
            "leads": leads,
            "rhythm_strip": rhythm_strip,
            "segmentation_confidence": seg_confidence
        }
