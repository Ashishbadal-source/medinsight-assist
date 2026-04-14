# new_pipeline/stage8_clinical_logic/clinical_safety.py

import numpy as np

def apply_clinical_guardrails(ecg_array: np.ndarray, diag_results: dict) -> dict:
    """
    Stage 8: Heuristic Clinical Checker.
    Overrules the AI model if classic textbook patterns (like Peaked T-waves 
    for Hyperkalemia) are detected in the raw signal but missed by the model.
    """
    # ecg_array shape: (12, 5000), representing 10s at 500Hz
    # Standard 12-lead order: I, II, III, aVR, aVL, aVF, V1, V2, V3, V4, V5, V6
    # Indices for V2-V5: 7, 8, 9, 10
    
    precordial_leads = [7, 8, 9, 10]
    peaked_t_count = 0
    
    for lead_idx in precordial_leads:
        signal = ecg_array[lead_idx]
        
        # Heuristic for Peaked T-waves:
        # 1. High absolute amplitude (T-wave amplitude in Hyperkalemia can exceed 1.0mV - 1.5mV)
        # 2. Narrow base (sharp gradients)
        max_amplitude = np.max(signal)
        min_amplitude = np.min(signal)
        
        # Gradient analysis to find "sharpness" (tent-shaped)
        gradients = np.abs(np.diff(signal))
        sharp_spikes = np.sum(gradients > 0.4)  # High threshold for sudden jumps typical of peaked T
        
        if max_amplitude > 1.2 and sharp_spikes > 5:
            peaked_t_count += 1

    # If multiple precordial leads show tent-shaped high-voltage peaks
    if peaked_t_count >= 2:
        # Override the AI's confusion
        hyperkalemia_finding = {'code': 'HYP (Hyperkalemia / Peaked T)', 'probability': 0.95}
        
        # Check if already present and boost, otherwise insert at top
        found = False
        for d in diag_results['diagnoses']:
            if 'HYP' in d['code'] or 'Hyperkalemia' in d['code']:
                d['probability'] = max(d['probability'], 0.95)
                found = True
                
        if not found:
            diag_results['diagnoses'].insert(0, hyperkalemia_finding)
            
        # Demote NORM (Normal) and IMI (Inferior Myocardial Infarction) if they were falsely flagged
        for d in diag_results['diagnoses']:
            if d['code'] in ['NORM', 'IMI']:
                d['probability'] = min(d['probability'], 0.25)
                
        # Re-sort to make the highest probability top
        diag_results['diagnoses'].sort(key=lambda x: -x['probability'])
        diag_results['top_diagnosis'] = diag_results['diagnoses'][0]

    return diag_results
