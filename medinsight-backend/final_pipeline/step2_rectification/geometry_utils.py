"""
step2_rectification/geometry_utils.py
Handles Fine Deskew and Perspective Correction for ECG images.
"""
import cv2
import numpy as np

def fine_deskew(img: np.ndarray, gray: np.ndarray) -> tuple[np.ndarray, float, bool]:
    """
    Sub-degree precision deskewing using weighted median of Hough angles.
    """
    h, w = gray.shape[:2]
    edges = cv2.Canny(gray, 50, 150)
    
    # Use Probabilistic Hough for better line segment detection
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, 50, minLineLength=w//10, maxLineGap=20)
    
    angles = []
    weights = []
    if lines is not None:
        for x1, y1, x2, y2 in lines[:, 0]:
            angle = np.degrees(np.arctan2(y2 - y1, x2 - x1))
            length = np.sqrt((x2-x1)**2 + (y2-y1)**2)
            # We are interested in horizontal-ish lines (near 0 deg)
            if -15 < angle < 15:
                angles.append(angle)
                weights.append(length)

    if not angles:
        return img, 0.0, False

    # Weighted median angle
    def weighted_median(data, weights):
        data, weights = np.array(data), np.array(weights)
        indices = np.argsort(data)
        data, weights = data[indices], weights[indices]
        weights_cumulative = np.cumsum(weights)
        median_weight = np.sum(weights) / 2.0
        return data[np.searchsorted(weights_cumulative, median_weight)]

    median_angle = float(weighted_median(angles, weights))
    
    # Safety clamp: if more than 8 degrees, likely wrong detection or too skewed for this method
    if abs(median_angle) > 8.0:
        return img, 0.0, False

    # Rotate the image
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, median_angle, 1.0)
    # Use BORDER_CONSTANT with white to avoid black corner artifacts for the crop step
    rotated = cv2.warpAffine(img, matrix, (w, h), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=(255, 255, 255))
    
    return rotated, median_angle, True

def perspective_correction(img: np.ndarray, gray: np.ndarray) -> tuple[np.ndarray, bool]:
    """
    Corrects perspective distortion in phone photos.
    Uses contour-based quadrilateral detection with a Hough-line fallback.
    """
    h, w = gray.shape[:2]
    
    # 1. Edge detection and cleaning
    edges = cv2.Canny(gray, 30, 100) # Lowered thresholds
    kernel = np.ones((5, 5), np.uint8)
    dilated = cv2.dilate(edges, kernel, iterations=1)
    
    # 2. Find contours
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    target_quad = None
    if contours:
        # Largest contour by area
        contours = sorted(contours, key=cv2.contourArea, reverse=True)
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < (h * w * 0.3): # Must be at least 30% of image
                break
                
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
            
            if len(approx) == 4:
                target_quad = approx
                break

    if target_quad is None:
        # Stage 2: Hough fallback
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, 80, minLineLength=min(h, w)//4, maxLineGap=50)
        if lines is not None and len(lines) >= 4:
            # Simple fallback: use the bounding box of the longest lines
            all_pts = lines.reshape(-1, 2)
            rect_min = np.min(all_pts, axis=0)
            rect_max = np.max(all_pts, axis=0)
            target_quad = np.array([
                [rect_min[0], rect_min[1]],
                [rect_max[0], rect_min[1]],
                [rect_max[0], rect_max[1]],
                [rect_min[0], rect_max[1]]
            ], dtype="float32").reshape((4, 1, 2))
        else:
            return img, False

    # 3. Apply Transform
    def order_points(pts):
        pts = pts.reshape((4, 2))
        rect = np.zeros((4, 2), dtype="float32")
        s = pts.sum(axis=1)
        rect[0] = pts[np.argmin(s)] # Top-left
        rect[2] = pts[np.argmax(s)] # Bottom-right
        diff = np.diff(pts, axis=1)
        rect[1] = pts[np.argmin(diff)] # Top-right
        rect[3] = pts[np.argmax(diff)] # Bottom-left
        return rect

    rect = order_points(target_quad)
    (tl, tr, br, bl) = rect

    # Compute width and height of the new image
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))

    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(img, M, (maxWidth, maxHeight), flags=cv2.INTER_LANCZOS4)

    # 4. Validation
    # Aspect ratio check (valid ECG range roughly 1.1 to 1.8 for standard prints)
    out_aspect = maxWidth / float(maxHeight + 1e-6)
    if not (1.1 <= out_aspect <= 1.8):
        return img, False

    return warped, True
