import os
import cv2
import numpy as np
import pytesseract
import fitz  # pymupdf

# Windows pe tesseract path
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text(file_path: str) -> str:
    ext = file_path.rsplit(".", 1)[-1].lower()
    if ext == "pdf":
        text = _extract_from_pdf(file_path)
    else:
        text = _extract_from_image(file_path)
    
    print("=== OCR OUTPUT ===")
    print(text)
    print("==================")
    return text

def _extract_from_pdf(path: str) -> str:
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def _extract_from_image(path: str) -> str:
    img = cv2.imread(path)
    img = cv2.resize(img, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Sharpen
    kernel = np.array([[0,-1,0],[-1,5,-1],[0,-1,0]])
    gray = cv2.filter2D(gray, -1, kernel)
    
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    
    custom_config = r'--oem 3 --psm 6'
    try:
        text = pytesseract.image_to_string(gray, config=custom_config)
    except pytesseract.TesseractNotFoundError:
        print("WARNING: Tesseract OCR is not installed or not in PATH. Cannot extract text from image.")
        text = ""
    return text