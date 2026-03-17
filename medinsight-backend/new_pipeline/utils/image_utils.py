# new_pipeline/utils/image_utils.py

import cv2
import numpy as np


def load_image(image_path: str) -> np.ndarray:
    """
    Load image from path, verify it's readable.
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Image not found or unreadable: {image_path}")
    return img


def save_image(img: np.ndarray, path: str) -> None:
    """
    Save image to disk.
    """
    cv2.imwrite(path, img)


def resize_image(img: np.ndarray, 
                  width: int = None, 
                  height: int = None, 
                  scale: float = None,
                  interpolation=cv2.INTER_LANCZOS4) -> np.ndarray:
    """
    Resize image by width/height or scale factor.
    LANCZOS4 default — best quality (5th place confirmed).
    """
    if scale is not None:
        return cv2.resize(img, None, fx=scale, fy=scale, 
                          interpolation=interpolation)
    
    h, w = img.shape[:2]
    
    if width and height:
        return cv2.resize(img, (width, height), interpolation=interpolation)
    elif width:
        ratio = width / w
        return cv2.resize(img, (width, int(h * ratio)), 
                          interpolation=interpolation)
    elif height:
        ratio = height / h
        return cv2.resize(img, (int(w * ratio), height), 
                          interpolation=interpolation)
    
    return img


def to_grayscale(img: np.ndarray) -> np.ndarray:
    """
    Convert BGR to grayscale.
    """
    if len(img.shape) == 2:
        return img  # already grayscale
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


def to_bgr(img: np.ndarray) -> np.ndarray:
    """
    Convert grayscale to BGR.
    """
    if len(img.shape) == 3:
        return img  # already BGR
    return cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)


def normalize_image(img: np.ndarray) -> np.ndarray:
    """
    Normalize pixel values to [0, 1] float32.
    """
    return img.astype(np.float32) / 255.0


def denormalize_image(img: np.ndarray) -> np.ndarray:
    """
    Convert [0, 1] float back to uint8.
    """
    return (img * 255).clip(0, 255).astype(np.uint8)


def pad_to_square(img: np.ndarray, 
                   fill_value: int = 255) -> np.ndarray:
    """
    Pad image to square with fill_value (default white).
    Used before model inference.
    """
    h, w = img.shape[:2]
    size = max(h, w)
    
    if len(img.shape) == 3:
        padded = np.full((size, size, img.shape[2]), 
                          fill_value, dtype=img.dtype)
    else:
        padded = np.full((size, size), fill_value, dtype=img.dtype)
    
    # Center paste
    y_offset = (size - h) // 2
    x_offset = (size - w) // 2
    padded[y_offset:y_offset+h, x_offset:x_offset+w] = img
    
    return padded


def longest_resize_with_pad(img: np.ndarray, 
                              target_size: int,
                              fill_value: int = 255) -> tuple:
    """
    Resize longest side to target_size, pad shorter side.
    5th place used this for keypoint model input.
    Returns: (padded_img, scale, pad_x, pad_y)
    """
    h, w = img.shape[:2]
    scale = target_size / max(h, w)
    
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    resized = cv2.resize(img, (new_w, new_h), 
                          interpolation=cv2.INTER_LANCZOS4)
    
    pad_x = (target_size - new_w) // 2
    pad_y = (target_size - new_h) // 2
    
    if len(img.shape) == 3:
        padded = np.full((target_size, target_size, img.shape[2]),
                          fill_value, dtype=img.dtype)
    else:
        padded = np.full((target_size, target_size), 
                          fill_value, dtype=img.dtype)
    
    padded[pad_y:pad_y+new_h, pad_x:pad_x+new_w] = resized
    
    return padded, scale, pad_x, pad_y


def crop_top_region(img: np.ndarray, 
                     crop_ratio: float = 0.25) -> np.ndarray:
    """
    Remove top portion (header/patient info).
    4th place: crop top 25% before processing.
    """
    h = img.shape[0]
    start_y = int(h * crop_ratio)
    return img[start_y:, :]


def add_coordinate_channels(img: np.ndarray) -> np.ndarray:
    """
    Add x and y coordinate maps as extra channels.
    1st place technique — spatial context for model.
    Input:  H x W x 3 (BGR)
    Output: H x W x 5 (BGR + x_coord + y_coord)
    """
    h, w = img.shape[:2]
    
    # Normalized coordinate grids [0, 1]
    x_map = np.tile(np.linspace(0, 1, w), (h, 1)).astype(np.float32)
    y_map = np.tile(np.linspace(0, 1, h), (w, 1)).T.astype(np.float32)
    
    # Scale to [0, 255] for consistency
    x_channel = (x_map * 255).astype(np.uint8)
    y_channel = (y_map * 255).astype(np.uint8)
    
    return np.dstack([img, x_channel, y_channel])


def visualize_grid_points(img: np.ndarray, 
                           points: np.ndarray,
                           color: tuple = (0, 255, 0),
                           radius: int = 3) -> np.ndarray:
    """
    Debug utility — draw detected grid points on image.
    """
    vis = img.copy()
    for pt in points:
        x, y = int(pt[0]), int(pt[1])
        cv2.circle(vis, (x, y), radius, color, -1)
    return vis
