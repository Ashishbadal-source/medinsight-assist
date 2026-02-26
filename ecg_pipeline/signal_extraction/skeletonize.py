import cv2

def skeletonize(mask):
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3,3))
    skel = mask.copy()
    skel[:] = 0

    temp = mask.copy()
    while True:
        eroded = cv2.erode(temp, kernel)
        opened = cv2.dilate(eroded, kernel)
        temp2 = cv2.subtract(temp, opened)
        skel = cv2.bitwise_or(skel, temp2)
        temp = eroded.copy()
        if cv2.countNonZero(temp) == 0:
            break
    return skel

