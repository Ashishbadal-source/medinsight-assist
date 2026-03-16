# # Normal ranges — (min, max, unit)
# NORMAL_RANGES = {
#     "hemoglobin": {
#         "male":   (13.5, 17.5, "g/dL"),
#         "female": (11.0, 16.0, "g/dL"),
#         "default":(11.0, 17.5, "g/dL"),
#     },
#     "rbc": {
#         "male":   (4.5, 5.9, "10^6/uL"),
#         "female": (3.5, 5.5, "10^6/uL"),
#         "default":(3.5, 5.9, "10^6/uL"),
#     },
#     "hct": {
#         "male":   (41.0, 53.0, "%"),
#         "female": (37.0, 50.0, "%"),
#         "default":(37.0, 53.0, "%"),
#     },
#     "mcv":     {"default": (80.0, 100.0, "fL")},
#     "mch":     {"default": (27.0, 33.0, "pg")},
#     "mchc":    {"default": (32.0, 36.0, "g/dL")},
#     "rdw_cv":  {"default": (11.5, 14.5, "%")},
#     "rdw_sd":  {"default": (35.0, 56.0, "fL")},
#     "wbc":     {"default": (4.5, 11.0, "10^3/uL")},
#     "neu":     {"default": (40.0, 70.0, "%")},
#     "lym":     {"default": (20.0, 45.0, "%")},
#     "mon":     {"default": (2.0, 10.0, "%")},
#     "eos":     {"default": (1.0, 6.0, "%")},
#     "bas":     {"default": (0.0, 2.0, "%")},
#     "lym_abs": {"default": (1.5, 4.0, "10^3/uL")},
#     "gra":     {"default": (2.0, 7.5, "10^3/uL")},
#     "plt":     {"default": (150.0, 450.0, "10^3/uL")},
#     "esr": {
#         "male":   (0.0, 15.0, "mm/hr"),
#         "female": (0.0, 20.0, "mm/hr"),
#         "default":(0.0, 20.0, "mm/hr"),
#     },
# }

# DISPLAY_NAMES = {
#     "hemoglobin": "Hemoglobin",
#     "rbc": "RBC",
#     "hct": "Hematocrit (HCT)",
#     "mcv": "MCV",
#     "mch": "MCH",
#     "mchc": "MCHC",
#     "rdw_cv": "RDW-CV",
#     "rdw_sd": "RDW-SD",
#     "wbc": "WBC",
#     "neu": "Neutrophils %",
#     "lym": "Lymphocytes %",
#     "mon": "Monocytes %",
#     "eos": "Eosinophils %",
#     "bas": "Basophils %",
#     "lym_abs": "Lymphocytes #",
#     "gra": "Granulocytes #",
#     "plt": "Platelets",
#     "esr": "ESR",
# }

# def analyze_blood(parsed: dict, gender: str = "default") -> dict:
#     findings = []
#     abnormal = []

#     for key, value in parsed.items():
#         if key not in NORMAL_RANGES:
#             continue

#         ranges = NORMAL_RANGES[key]
#         low, high, unit = ranges.get(gender, ranges["default"])

#         if value < low:
#             status = "LOW"
#             abnormal.append(key)
#         elif value > high:
#             status = "HIGH"
#             abnormal.append(key)
#         else:
#             status = "NORMAL"

#         findings.append({
#             "name": DISPLAY_NAMES.get(key, key.upper()),
#             "value": value,
#             "unit": unit,
#             "normal_range": f"{low} - {high}",
#             "status": status,
#         })

#     # Summary
#     if not abnormal:
#         summary = "All parameters within normal range."
#         severity = "normal"
#     elif len(abnormal) <= 2:
#         summary = f"{len(abnormal)} parameter(s) outside normal range — mild concern."
#         severity = "mild"
#     else:
#         summary = f"{len(abnormal)} parameter(s) outside normal range — please consult a doctor."
#         severity = "high"

#     return {
#         "success": True,
#         "findings": findings,
#         "summary": summary,
#         "severity": severity,
#         "abnormal_count": len(abnormal),
#         "total_count": len(findings),
#     }









# Normal ranges — (min, max, unit)
NORMAL_RANGES = {
    "hemoglobin": {
        "male":   (13.5, 17.5, "g/dL"),
        "female": (11.0, 16.0, "g/dL"),
        "default":(11.0, 17.5, "g/dL"),
    },
    "rbc": {
        "male":   (4.5, 5.9, "10^6/uL"),
        "female": (3.5, 5.5, "10^6/uL"),
        "default":(3.5, 5.9, "10^6/uL"),
    },
    "hct": {
        "male":   (41.0, 53.0, "%"),
        "female": (37.0, 50.0, "%"),
        "default":(37.0, 53.0, "%"),
    },
    "mcv":     {"default": (80.0, 100.0, "fL")},
    "mch":     {"default": (27.0, 33.0, "pg")},
    "mchc":    {"default": (32.0, 36.0, "g/dL")},
    "rdw_cv":  {"default": (11.5, 14.5, "%")},
    "rdw_sd":  {"default": (35.0, 56.0, "fL")},
    "wbc":     {"default": (4.5, 11.0, "10^3/uL")},
    "neu":     {"default": (40.0, 70.0, "%")},
    "lym":     {"default": (20.0, 45.0, "%")},
    "mon":     {"default": (2.0, 10.0, "%")},
    "eos":     {"default": (1.0, 6.0, "%")},
    "bas":     {"default": (0.0, 2.0, "%")},
    "lym_abs": {"default": (1.5, 4.0, "10^3/uL")},
    "gra":     {"default": (2.0, 7.5, "10^3/uL")},
    "plt":     {"default": (150.0, 450.0, "10^3/uL")},
    "esr": {
        "male":   (0.0, 15.0, "mm/hr"),
        "female": (0.0, 20.0, "mm/hr"),
        "default":(0.0, 20.0, "mm/hr"),
    },
}

DISPLAY_NAMES = {
    "hemoglobin": "Hemoglobin",
    "rbc": "RBC",
    "hct": "Hematocrit (HCT)",
    "mcv": "MCV",
    "mch": "MCH",
    "mchc": "MCHC",
    "rdw_cv": "RDW-CV",
    "rdw_sd": "RDW-SD",
    "wbc": "WBC",
    "neu": "Neutrophils %",
    "lym": "Lymphocytes %",
    "mon": "Monocytes %",
    "eos": "Eosinophils %",
    "bas": "Basophils %",
    "lym_abs": "Lymphocytes #",
    "gra": "Granulocytes #",
    "plt": "Platelets",
    "esr": "ESR",
}


def detect_and_normalize(key, value):
    """Detect unit format and normalize to standard"""

    if key == "hemoglobin":
        if value > 25:        # g/L format (e.g. 126)
            return value / 10
        return value

    if key == "mchc":
        if value > 100:       # g/L format (e.g. 353)
            return value / 10
        return value

    if key == "hct":
        if value < 1:         # L/L format (e.g. 0.36)
            return value * 100
        return value

    if key == "wbc":
        if value > 100:       # cumm format (e.g. 9000)
            return value / 1000
        return value

    if key == "plt":
        if value > 10000:     # cumm format (e.g. 150000)
            return value / 1000
        return value

    return value


def analyze_blood(parsed: dict, gender: str = "default") -> dict:
    findings = []
    abnormal = []

    for key, value in parsed.items():
        if key not in NORMAL_RANGES:
            continue

        # Normalize units before comparing
        value = detect_and_normalize(key, value)

        ranges = NORMAL_RANGES[key]
        low, high, unit = ranges.get(gender, ranges["default"])

        if value < low:
            status = "LOW"
            abnormal.append(key)
        elif value > high:
            status = "HIGH"
            abnormal.append(key)
        else:
            status = "NORMAL"

        findings.append({
            "name": DISPLAY_NAMES.get(key, key.upper()),
            "value": round(value, 2),
            "unit": unit,
            "normal_range": f"{low} - {high}",
            "status": status,
        })

    # Summary
    if not abnormal:
        summary = "All parameters within normal range."
        severity = "normal"
    elif len(abnormal) <= 2:
        summary = f"{len(abnormal)} parameter(s) outside normal range — mild concern."
        severity = "mild"
    else:
        summary = f"{len(abnormal)} parameter(s) outside normal range — please consult a doctor."
        severity = "high"

    return {
        "success": True,
        "findings": findings,
        "summary": summary,
        "severity": severity,
        "abnormal_count": len(abnormal),
        "total_count": len(findings),
    }
