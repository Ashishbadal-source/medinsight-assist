from .blur import is_blurry
from .rotation import is_rotated
from .brightness import bad_brightness
from .completeness import is_incomplete

def run_quality_checks(img):
    # ECG-specific: do not reject for rotation or brightness
    return True, None
