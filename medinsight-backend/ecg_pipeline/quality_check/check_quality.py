import cv2

from .blur import check_blur
from .exposure import check_exposure
from .coverage import check_coverage

def check_quality(image_path):
    image = cv2.imread(image_path)

    if image is None:
        return {"quality_pass": False, "reasons": ["invalid_image"]}

    reasons = []

    if check_blur(image):
        reasons.append("blur")

    if check_exposure(image):
        reasons.append("exposure")

    if check_coverage(image):
        reasons.append("partial_ecg")

    # 🔥 DECISION RULE
    if len(reasons) >= 2:
        return {"quality_pass": False, "reasons": reasons}

    return {"quality_pass": True, "reasons": reasons}



#check   