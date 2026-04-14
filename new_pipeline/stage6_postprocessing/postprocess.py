# new_pipeline/stage6_postprocessing/postprocess.py

import numpy as np


def fuse_lead_ii(ii_short: np.ndarray,
                  ii_long: np.ndarray) -> np.ndarray:
    """
    Lead II fusion — 1st + 3rd place.
    Blend short Lead II with long rhythm strip
    in overlapping first quarter region.
    """
    n_short = len(ii_short)
    n_long  = len(ii_long)

    # Use long Lead II as base
    result = ii_long.copy()

    # Blend first quarter
    overlap = min(n_short // 4, n_long // 4)
    for i in range(overlap):
        alpha       = i / overlap  # 0→1
        result[i]   = (1 - alpha) * ii_short[i] + alpha * ii_long[i]

    return result


def einthoven_correction(signals: dict) -> dict:
    """
    Einthoven's Law: II = I + III
    3rd + 4th place: weighted correction.
    II gets higher weight (2), I and III equal lower weight (1).
    """
    I   = signals['I']
    II  = signals['II']
    III = signals['III']

    error = II - I - III
    mean_error = np.abs(error).mean()

    # Only apply if violation is significant
    if mean_error > 0.01:
        signals['I']   = I   + error * 0.25
        signals['II']  = II  - error * 0.50
        signals['III'] = III + error * 0.25

    return signals


def avr_avl_avf_correction(signals: dict) -> dict:
    """
    aVR + aVL + aVF = 0 correction (1st place).
    """
    aVR = signals['aVR']
    aVL = signals['aVL']
    aVF = signals['aVF']

    residual = aVR + aVL + aVF
    mean_res = np.abs(residual).mean()

    if mean_res < 0.01:
        correction     = residual / 3.0
        signals['aVR'] = aVR - correction
        signals['aVL'] = aVL - correction
        signals['aVF'] = aVF - correction

    return signals


def postprocess_leads(leads: dict) -> dict:
    """
    Full post-processing pipeline.
    Input:  dict of resampled leads
    Output: dict of corrected leads (12 standard leads)
    """
    # Step 1: Lead II fusion
    if 'II_long' in leads and 'II' in leads:
        leads['II'] = fuse_lead_ii(leads['II'], leads['II_long'])

    # Remove II_long — not a standard lead
    leads.pop('II_long', None)

    # Step 2: Einthoven correction
    leads = einthoven_correction(leads)

    # Step 3: aVR/aVL/aVF correction
    leads = avr_avl_avf_correction(leads)

    return leads


LEAD_ORDER = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF',
              'V1', 'V2', 'V3', 'V4', 'V5', 'V6']


def leads_to_array(leads: dict) -> np.ndarray:
    """
    Convert leads dict to (12, 5000) numpy array.
    Standard lead order.
    """
    return np.stack([leads[name] for name in LEAD_ORDER])