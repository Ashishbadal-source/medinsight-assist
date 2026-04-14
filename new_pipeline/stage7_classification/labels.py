# new_pipeline/stage7_classification/labels.py

# ── PTB-XL SCP Codes ──────────────────────────────────────────────────────────
# 44 Diagnostic Subclasses
DIAGNOSTIC_SUBCLASSES = {
    'NORM':   'Normal ECG',
    'IMI':    'Inferior Myocardial Infarction',
    'ASMI':   'Anteroseptal Myocardial Infarction',
    'ILMI':   'Inferolateral Myocardial Infarction',
    'AMI':    'Anterior Myocardial Infarction',
    'ALMI':   'Anterolateral Myocardial Infarction',
    'INJAS':  'Subendocardial Injury Anteroseptal',
    'LMI':    'Lateral Myocardial Infarction',
    'INJAL':  'Subendocardial Injury Anterolateral',
    'ISCAL':  'Ischemia Anterolateral',
    'INJIN':  'Subendocardial Injury Inferior',
    'ISCIN':  'Ischemia Inferior',
    'INJLA':  'Subendocardial Injury Lateral',
    'RMI':    'Right Myocardial Infarction',
    'ISCAN':  'Ischemia Anterior',
    'ISCLA':  'Ischemia Lateral',
    'ISC_':   'Non-specific Ischemia',
    'ISCAS':  'Ischemia Anteroseptal',
    'INJIL':  'Subendocardial Injury Inferolateral',
    'ISCIL':  'Ischemia Inferolateral',
    'ABQRS':  'Abnormal QRS',
    'PVC':    'Premature Ventricular Contraction',
    'STD_':   'Non-specific ST Depression',
    'VCLVH':  'Voltage Criteria LVH',
    'QWAVE':  'Pathologic Q Wave',
    'LOWT':   'Low T Voltage',
    'NST_':   'Non-specific ST Changes',
    'PAC':    'Premature Atrial Contraction',
    'LPR':    'Long PR Interval',
    'INVT':   'Inverted T Waves',
    'LVOLT':  'Low Voltage',
    'HVOLT':  'High Voltage',
    'TAB_':   'T-wave Abnormality',
    'STE_':   'Non-specific ST Elevation',
    'PRC(S)': 'Pacemaker Rhythm',
    'LNGQT':  'Long QT Interval',
    'ANEUR':  'Ventricular Aneurysm',
    'WPW':    'Wolff-Parkinson-White',
    'ILBBB':  'Incomplete Left Bundle Branch Block',
    'IRBBB':  'Incomplete Right Bundle Branch Block',
    'LAFB':   'Left Anterior Fascicular Block',
    'LPFB':   'Left Posterior Fascicular Block',
    'CLBBB':  'Complete Left Bundle Branch Block',
    'CRBBB':  'Complete Right Bundle Branch Block',
}

# ── 23 Rhythm Classes ─────────────────────────────────────────────────────────
RHYTHM_CLASSES = {
    'SR':    'Sinus Rhythm',
    'AFIB':  'Atrial Fibrillation',
    'STACH': 'Sinus Tachycardia',
    'SARRH': 'Sinus Arrhythmia',
    'SBRAD': 'Sinus Bradycardia',
    'PACE':  'Paced Rhythm',
    'SVARR': 'Supraventricular Arrhythmia',
    'BIGU':  'Bigeminy',
    'AFLT':  'Atrial Flutter',
    'SVTAC': 'Supraventricular Tachycardia',
    'PSVT':  'Paroxysmal SVT',
    'TRIGU': 'Trigeminy',
    'JUNCT': 'Junctional Rhythm',
    'IDIO':  'Idioventricular Rhythm',
    'VTACH': 'Ventricular Tachycardia',
    'VFIB':  'Ventricular Fibrillation',
    'VFLUT': 'Ventricular Flutter',
    'AROU':  'Arousal',
    'DISS':  'AV Dissociation',
    'WPW':   'WPW Syndrome',
    'AVNRT': 'AV Nodal Reentrant Tachycardia',
    'AVRT':  'AV Reentrant Tachycardia',
    'SINUS': 'Sinus Rhythm (unspecified)',
}

# ── Severity Mapping ──────────────────────────────────────────────────────────
SEVERITY = {
    'CRITICAL': ['VTACH','VFIB','VFLUT','AFIB','AFLT','WPW',
                 'AMI','ALMI','ILMI','ASMI','IMI','LMI','RMI'],
    'HIGH':     ['CLBBB','CRBBB','LNGQT','ANEUR','SVTAC','PSVT',
                 'INJIN','INJAL','INJLA','INJIL','INJAS','INJIL'],
    'MEDIUM':   ['STACH','SBRAD','PAC','PVC','STD_','STE_',
                 'QWAVE','INVT','TAB_','NST_','ISC_'],
    'LOW':      ['NORM','SR','SARRH','LVOLT','HVOLT','LOWT',
                 'LPR','IRBBB','ILBBB','LAFB','LPFB'],
}

def get_severity(scp_code: str) -> str:
    for level, codes in SEVERITY.items():
        if scp_code in codes:
            return level
    return 'UNKNOWN'