import cv2
import numpy as np

def is_rotated(img, angle_threshold=90):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    lines = cv2.HoughLines(edges, 1, np.pi/180, 200)

    if lines is None:
        return False

    for i in range(len(lines)):
        rho, theta = lines[i][0]
        angle = abs(theta * 180 / np.pi - 90)
        if angle > angle_threshold:
            return True
    return False
