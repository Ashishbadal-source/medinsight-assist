import numpy as np
import cv2


def crop_leads(mask, num_rows=3, leads_per_row=4, band_height_ratio=0.15):
    """
    Split ECG mask into 12 lead masks using row-based layout
    """

    h, w = mask.shape
    lead_masks = []

    # ===============================
    # STEP 1: split into rows
    # ===============================
    row_height = h // num_rows

    for row in range(num_rows):
        row_start = row * row_height
        row_end = (row + 1) * row_height

        row_slice = mask[row_start:row_end, :]

        # ===============================
        # STEP 2: find waveform band in this row
        # ===============================
        projection = np.sum(row_slice > 0, axis=1)

        if np.max(projection) == 0:
            continue

        center = np.argmax(projection)

        band_half = int(row_height * band_height_ratio / 2)

        top = max(center - band_half, 0)
        bottom = min(center + band_half, row_slice.shape[0])

        waveform_band = row_slice[top:bottom, :]

        # ===============================
        # STEP 3: split into columns (leads)
        # ===============================
        col_width = w // leads_per_row

        for col in range(leads_per_row):
            col_start = col * col_width
            col_end = (col + 1) * col_width

            lead = waveform_band[:, col_start:col_end]
            lead_masks.append(lead)

    return lead_masks
