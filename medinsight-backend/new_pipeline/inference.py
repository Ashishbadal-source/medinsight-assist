# new_pipeline/inference.py

import cv2
import numpy as np
import os
from pathlib import Path

# NOTE: We keep torch for the Classification Stage but use TensorFlow for Segmentation
import torch
import torch.nn as nn
import tensorflow as tf
from tensorflow.keras import layers, models

from new_pipeline.stage0_orientation.correct_orientation import correct_orientation
from new_pipeline.stage1_rectification.rectify import build_rectified_image
from new_pipeline.stage1_rectification.detect_grid import detect_grid_intersections
from new_pipeline.stage2_lead_crop.crop_leads import crop_all_leads
from new_pipeline.stage2_lead_crop.blank_template import prepare_lead_inputs
from new_pipeline.stage4_signal_extraction.extract_signal import extract_leads_from_heatmaps
from new_pipeline.stage5_resampling.resample import resample_all_leads
from new_pipeline.stage6_postprocessing.postprocess import postprocess_leads, leads_to_array
from new_pipeline.stage7_classification.classify import ECGClassifierService
from new_pipeline.stage8_clinical_logic.clinical_safety import apply_clinical_guardrails

# ── Keras Model Architecture (Exact match to training) ────────────────────────

def build_keras_unet(H=160, W=320):
    base = tf.keras.applications.MobileNetV2(input_shape=(H, W, 3), include_top=False, weights=None)
    # Using layer names from standard MobileNetV2 for skip connections
    l1 = base.get_layer('block_1_expand_relu').output # 80x160
    l2 = base.get_layer('block_3_expand_relu').output # 40x80
    l3 = base.get_layer('block_6_expand_relu').output # 20x40
    l4 = base.output # 5x10 (approx)
    
    x = layers.UpSampling2D(2)(l4)
    x = layers.Concatenate()([x, layers.Resizing(10, 20)(l3)])
    x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
    
    x = layers.UpSampling2D(2)(x)
    x = layers.Concatenate()([x, layers.Resizing(20, 40)(l2)])
    x = layers.Conv2D(64, 3, padding='same', activation='relu')(x)
    
    x = layers.UpSampling2D(4)(x)
    x = layers.Concatenate()([x, l1])
    x = layers.Conv2D(32, 3, padding='same', activation='relu')(x)
    
    x = layers.UpSampling2D(2)(x)
    out = layers.Conv2D(1, 1, activation='sigmoid')(x)
    return models.Model(inputs=base.input, outputs=out)

# ── Pipeline Manager ──────────────────────────────────────────────────────────

class ECGPipelineManager:
    _instance = None

    def __init__(self):
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.seg_model = None
        self.models_loaded = False
        self.H, self.W = 160, 320

    @classmethod
    def get_instance(cls):
        if cls._instance is None: cls._instance = cls()
        return cls._instance

    def load_models(self, seg_weights: str):
        print(f"Loading High-Fidelity Pipeline (TF Hybrid)...")
        
        # 1. Segmentation (TensorFlow)
        self.seg_model = build_keras_unet(self.H, self.W)
        if seg_weights and Path(seg_weights).exists():
            try:
                self.seg_model.load_weights(seg_weights)
                print(f"✅ Keras Segmentation weights loaded from {seg_weights}")
            except Exception as e:
                print(f"❌ Failed to load Keras weights: {e}")
        
        # 2. Classification (PyTorch)
        self.classifier_service = ECGClassifierService
        print("✅ Classification service initialized")
        
        self.models_loaded = True

    def run(self, image_path: str) -> dict:
        if not self.models_loaded: raise RuntimeError("Models not loaded.")

        try:
            # Stages 0-2 (Image Processing)
            img = cv2.imread(image_path)
            img = correct_orientation(img)
            img_rect = build_rectified_image(img)
            grid_points = detect_grid_intersections(img_rect)
            crops = crop_all_leads(img_rect, grid_points)
            lead_inputs = prepare_lead_inputs(crops) # Returns dict of 4-ch crops

            # Stage 3: Segmentation Inference (TF)
            series_list = self._prepare_series_list(lead_inputs)
            heatmaps_np = []
            for s_batch in series_list:
                # s_batch is (1, 160, 320, 3)
                pred = self.seg_model.predict(s_batch, verbose=0)
                heatmaps_np.append(pred[0, :, :, 0]) # Extract 2D heatmap

            # Stage 4-6: Extraction & Refinement
            leads = extract_leads_from_heatmaps(heatmaps_np)
            leads = resample_all_leads(leads, target_length=5000)
            ecg_array = leads_to_array(postprocess_leads(leads))

            # Stage 7: Advanced Classification (PyTorch)
            # Ensure classification service is ready
            diag_results = self.classifier_service.predict(ecg_array)

            # Stage 8: Heuristic Clinical Guardrails (e.g., Hyperkalemia Check)
            diag_results = apply_clinical_guardrails(ecg_array, diag_results)

            return {
                'status': 'success',
                'ecg_id': Path(image_path).stem,
                'diagnosis': diag_results['top_diagnosis'],
                'all_findings': diag_results['diagnoses'],
                'rhythms': diag_results['rhythms'],
                'ecg_signal': ecg_array.tolist()
            }

        except Exception as e:
            import traceback
            traceback.print_exc()
            return {'status': 'error', 'message': str(e)}

    def _prepare_series_list(self, lead_inputs: dict) -> list:
        # Layout matching training SERIES_LAYOUT
        SERIES_LAYOUT = [['I','aVR','V1','V4'],['II','aVL','V2','V5'],['III','aVF','V3','V6'],['II']]
        batches = []
        
        for leads in SERIES_LAYOUT:
            if len(leads) == 1:
                # Rhythm strip (often Lead II)
                crop_4ch = lead_inputs.get('II_long', lead_inputs.get('II'))
            else:
                combined = []
                for l in leads:
                    combined.append(lead_inputs.get(l, np.zeros((212, 137, 4), dtype=np.uint8)))
                crop_4ch = np.concatenate(combined, axis=1)
            
            # 1. Resize to target
            crop_4ch = cv2.resize(crop_4ch, (self.W, self.H))
            
            # 2. CPU Blending (Matching "SanityDS" training logic)
            # crop_4ch has 4 channels: [R, G, B, GridTemplate]
            rgb = crop_4ch[:, :, :3].astype(np.float32)
            grid = crop_4ch[:, :, 3:].astype(np.float32)
            
            # final = 0.9*rgb + 0.1*grid_template
            blended = (rgb * 0.9 + grid * 0.1).astype(np.float32) / 255.0
            
            # 3. Add batch dimension: (1, 160, 320, 3)
            batches.append(np.expand_dims(blended, axis=0))
            
        return batches