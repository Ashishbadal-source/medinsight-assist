# import re

# # Test name aliases — OCR sometimes reads differently
# TEST_ALIASES = {
#     "hemoglobin": ["hemoglobin", "hgb", "hb"],
#     "rbc": ["rbc", "red blood cell", "red blood count"],
#     "hct": ["hct", "hematocrit"],
#     "mcv": ["mcv"],
#     "mch": ["mch"],
#     "mchc": ["mchc"],
#     "rdw_cv": ["rdw-cv", "rdw cv", "rdwcv"],
#     "rdw_sd": ["rdw-sd", "rdw sd"],
#     "wbc": ["wbc", "white blood cell", "white blood count", "leukocytes"],
#     "neu": ["neu%", "neu", "neutrophil", "neut%"],
#     "lym": ["lym%", "lym", "lymphocyte", "lymph%"],
#     "mon": ["mon%", "mon", "monocyte", "mono%"],
#     "eos": ["eos%", "eos", "eosinophil"],
#     "bas": ["bas%", "bas", "basophil"],
#     "lym_abs": ["lym#", "lymph#"],
#     "gra": ["gra#", "gran#"],
#     "plt": ["plt", "platelet", "thrombocyte"],
#     "esr": ["esr", "erythrocyte sedimentation"],
# }

# def parse_values(text: str) -> dict:
#     results = {}
#     lines = text.lower().split("\n")
    
#     for line in lines:
#         line = line.strip()
#         if not line:
#             continue
            
#         for key, aliases in TEST_ALIASES.items():
#             for alias in aliases:
#                 if alias in line:
#                     # Extract number from line
#                     numbers = re.findall(r'\d+\.\d+|\d+', line)
#                     if numbers:
#                         try:
#                             results[key] = float(numbers[0])
#                         except:
#                             pass
#                     break
    
#     return results





# import re

# # Test name aliases — OCR sometimes reads differently
# TEST_ALIASES = {
#     "hemoglobin": ["hemoglobin", "hgb", "hb"],
#     "rbc":        ["rbc", "red blood cell", "red blood count"],
#     "hct":        ["hct", "hematocrit"],
#     "mcv":        ["mcv"],
#     "mchc":       ["mchc"],
#     "mch":        [" mch ", "mch "],
#     "rdw_cv":     ["rdw-cv", "rdw cv", "rdwcv", "rdw<v", "row-cv", "row<v"],
#     "rdw_sd":     ["rdw-sd", "rdw sd", "row-sd", "row-so"],
#     "wbc":        ["wbc", "white blood cell", "white blood count", "leukocytes"],
#     "neu":        ["neu%", "neu", "neutrophil", "neut%"],
#     "lym":        ["lym%", "lym", "lymphocyte", "lymph%"],
#     "mon":        ["mon%", "mon", "monocyte", "mono%"],
#     "eos":        ["eos%", "eos", "eosinophil"],
#     "bas":        ["bas%", "bas", "basophil"],
#     "lym_abs":    ["lym#", "lymph#", "lyme"],
#     "gra":        ["gra#", "gran#", "gra"],
#     "plt":        ["plt", "platelet", "thrombocyte"],
#     "esr":        ["esr", "erythrocyte sedimentation"],
# }

# # Expected value ranges for OCR correction
# EXPECTED_RANGES = {
#     "hemoglobin": (7.0,   20.0),
#     "rbc":        (2.0,   7.0),
#     "hct":        (20.0,  60.0),
#     "mcv":        (60.0,  120.0),
#     "mchc":       (25.0,  40.0),
#     "mch":        (15.0,  40.0),
#     "rdw_cv":     (8.0,   20.0),
#     "rdw_sd":     (25.0,  70.0),
#     "wbc":        (1.0,   30.0),
#     "neu":        (20.0,  90.0),
#     "lym":        (10.0,  60.0),
#     "mon":        (1.0,   15.0),
#     "eos":        (0.0,   10.0),
#     "bas":        (0.0,   3.0),
#     "lym_abs":    (0.5,   6.0),
#     "gra":        (1.0,   15.0),
#     "plt":        (50.0,  700.0),
#     "esr":        (0.0,   50.0),
# }

# def fix_value(key, value):
#     """Fix common OCR errors — divide/multiply by 10 if out of range"""
#     if key not in EXPECTED_RANGES:
#         return value
#     lo, hi = EXPECTED_RANGES[key]
#     if lo <= value <= hi:
#         return value
#     # Too high — try divide by 10
#     candidate = value / 10
#     if lo <= candidate <= hi:
#         return candidate
#     # Too low — try multiply by 10
#     candidate = value * 10
#     if lo <= candidate <= hi:
#         return candidate
#     return value


# def parse_values(text: str) -> dict:
#     results = {}
#     lines = text.lower().split("\n")

#     for line in lines:
#         line = line.strip()
#         if not line:
#             continue

#         for key, aliases in TEST_ALIASES.items():
#             for alias in aliases:
#                 if alias in line:
#                     numbers = re.findall(r'\d+\.\d+|\d+', line)
#                     if numbers:
#                         try:
#                             raw = float(numbers[0])
#                             results[key] = fix_value(key, raw)
#                         except:
#                             pass
#                     break

#     return results








import re

# Test name aliases — OCR sometimes reads differently
TEST_ALIASES = {
    "hemoglobin": ["hemoglobin", "hgb", "hb", "haemoglobin"],
    "rbc":        ["rbc", "red blood cell", "red blood count", "total rbc", "rbc count"],
    "hct":        ["hct", "hematocrit", "het", "packed cell volume"],
    "mcv":        ["mcv", "mlv"],
    "mchc":       ["mchc"],
    "mch":        [" mch ", "mch "],
    "rdw_cv":     ["rdw-cv", "rdw cv", "rdwcv", "rdw<v", "row-cv", "row<v", "rdw"],
    "rdw_sd":     ["rdw-sd", "rdw sd", "row-sd", "row-so"],
    "wbc":        ["wbc", "white blood cell", "white blood count", "leukocytes", "total wbc count", "wbc count"],
    "neu":        ["neu%", "neu", "neutrophil", "neut%", "neutro%", "neutro"],
    "lym":        ["lym%", "lym", "lymphocyte", "lymph%", "lymph%"],
    "mon":        ["mon%", "mon", "monocyte", "mono%", "mono%"],
    "eos":        ["eos%", "eos", "eosinophil", "ecs%", "ecs"],
    "bas":        ["bas%", "bas", "basophil", "baso%", "baso"],
    "lym_abs":    ["lym#", "lymph#", "lyme", "lymph #"],
    "gra":        ["gra#", "gran#", "gra"],
    "plt": ["plt", "platelet", "thrombocyte", "platelet count"],
    "esr":        ["esr", "erythrocyte sedimentation"],
}

# Expected value ranges for OCR correction
EXPECTED_RANGES = {
    "hemoglobin": (7.0,   200.0),  # g/L reports have higher values (e.g. 126 g/L)
    "rbc":        (2.0,   7.0),
    "hct":        (0.2,   60.0),   # some reports use L/L format (0.36)
    "mcv":        (60.0,  120.0),
    "mchc":       (25.0,  400.0),  # g/L format gives 310-360
    "mch":        (15.0,  40.0),
    "rdw_cv":     (8.0,   20.0),
    "rdw_sd":     (25.0,  70.0),
    "wbc":        (1.0,   30.0),
    "neu":        (10.0,  90.0),
    "lym":        (10.0,  80.0),
    "mon":        (1.0,   20.0),
    "eos":        (0.0,   10.0),
    "bas":        (0.0,   3.0),
    "lym_abs":    (0.5,   6.0),
    "gra":        (1.0,   15.0),
    "plt":        (50.0,  700.0),
    "esr":        (0.0,   50.0),
}

def fix_value(key, value):
    if key not in EXPECTED_RANGES:
        return value
    lo, hi = EXPECTED_RANGES[key]
    if lo <= value <= hi:
        return value
    # Repeatedly divide by 10 until in range or too small
    candidate = value
    for _ in range(4):
        candidate = candidate / 10
        if lo <= candidate <= hi:
            return candidate
    # Try multiply
    candidate = value * 10
    if lo <= candidate <= hi:
        return candidate
    return value


def parse_values(text: str) -> dict:
    results = {}
    lines = text.lower().split("\n")

    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Comma remove karo numbers se (7,300 → 7300)
        line = line.replace(",", "")

        for key, aliases in TEST_ALIASES.items():
            for alias in aliases:
                if alias in line:
                    numbers = re.findall(r'\d+\.\d+|\d+', line)
                    if numbers:
                        try:
                            raw = float(numbers[0])
                            results[key] = fix_value(key, raw)
                        except:
                            pass
                    break

    return results