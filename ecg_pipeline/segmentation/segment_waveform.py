# # # # import cv2
# # # # import torch
# # # # import numpy as np
# # # # from segmentation.unet import UNet

# # # # # load once
# # # # device = "cuda" if torch.cuda.is_available() else "cpu"
# # # # model = UNet(in_channels=1, out_channels=1).to(device)
# # # # model.load_state_dict(torch.load("segmentation/weights.pth", map_location=device))
# # # # model.eval()


# # # # def segment_waveform(img):
# # # #     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# # # #     resized = cv2.resize(gray, (512, 512))

# # # #     x = resized / 255.0
# # # #     x = torch.tensor(x, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(device)

# # # #     with torch.no_grad():
# # # #         mask = model(x)

# # # #     mask = mask.squeeze().cpu().numpy()
# # # #     mask = (mask > 0.5).astype(np.uint8) * 255

# # # #     return mask




# # # import cv2
# # # import torch
# # # import numpy as np
# # # import os

# # # from segmentation.unet import UNet

# # # device = "cuda" if torch.cuda.is_available() else "cpu"

# # # MODEL_PATH = os.path.join(
# # #     os.path.dirname(__file__),
# # #     "weights.pth"
# # # )

# # # model = UNet(in_channels=1, out_channels=1).to(device)
# # # model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
# # # model.eval()


# # # # def segment_waveform(img):
# # # #     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# # # #     gray = cv2.resize(gray, (512, 512))

# # # #     x = gray / 255.0
# # # #     x = torch.tensor(x, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(device)

# # # #     with torch.no_grad():
# # # #         mask = model(x)

# # # #     mask = mask.squeeze().cpu().numpy()
# # # #     mask = (mask > 0.5).astype(np.uint8) * 255

# # # #     return mask



# # # def segment_waveform(img):
# # #     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# # #     # blur to remove grid noise
# # #     blur = cv2.GaussianBlur(gray, (5, 5), 0)

# # #     # adaptive threshold (ECG-friendly)
# # #     mask = cv2.adaptiveThreshold(
# # #         blur,
# # #         255,
# # #         cv2.ADAPTIVE_THRESH_MEAN_C,
# # #         cv2.THRESH_BINARY_INV,
# # #         15,
# # #         5
# # #     )

# # #     return mask







# # import cv2
# # import numpy as np

# # # def segment_waveform(img):
# # #     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# # #     # 1️⃣ suppress grid (morphological opening)
# # #     kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 1))
# # #     kernel_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 25))

# # #     grid_h = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel_h)
# # #     grid_v = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel_v)

# # #     grid = cv2.add(grid_h, grid_v)
# # #     no_grid = cv2.subtract(gray, grid)

# # #     # 2️⃣ enhance waveform
# # #     blur = cv2.GaussianBlur(no_grid, (5, 5), 0)

# # #     _, mask = cv2.threshold(
# # #         blur, 0, 255,
# # #         cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
# # #     )

# # #     return mask



# # def segment_waveform(img):
# #     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# #     # contrast boost
# #     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
# #     gray = clahe.apply(gray)

# #     # adaptive threshold (ECG-friendly)
# #     mask = cv2.adaptiveThreshold(
# #         gray,
# #         255,
# #         cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
# #         cv2.THRESH_BINARY_INV,
# #         11,
# #         2
# #     )

# #     return mask









# import cv2
# import numpy as np

# def segment_waveform(img):
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#     # 1️⃣ adaptive threshold (capture waveform + grid)
#     mask = cv2.adaptiveThreshold(
#         gray,
#         255,
#         cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#         cv2.THRESH_BINARY_INV,
#         11,
#         2
#     )

#     # 2️⃣ remove vertical grid lines
#     kernel_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 15))
#     v_lines = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel_v)
#     mask = cv2.subtract(mask, v_lines)

#     # 3️⃣ remove horizontal grid lines
#     kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
#     h_lines = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel_h)
#     mask = cv2.subtract(mask, h_lines)

#     return mask















import cv2
import torch
import numpy as np
from segmentation.unet import UNet

# device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# load model once (IMPORTANT)
model = UNet(in_channels=1, out_channels=1).to(device)
model.load_state_dict(
    torch.load("segmentation/weights.pth", map_location=device)
)
model.eval()


def segment_waveform(img):
    """
    ML-based ECG waveform segmentation.
    Returns clean binary mask (waveform only).
    """

    # 1️⃣ grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 2️⃣ resize to UNet input (fixed)
    resized = cv2.resize(gray, (512, 512))
    resized = resized.astype(np.float32) / 255.0

    # 3️⃣ tensor
    x = torch.from_numpy(resized).unsqueeze(0).unsqueeze(0).to(device)

    # 4️⃣ inference
    with torch.no_grad():
        y = model(x)

    # 5️⃣ threshold
    mask = (y.squeeze().cpu().numpy() > 0.5).astype(np.uint8) * 255

    # 6️⃣ resize back to original size
    mask = cv2.resize(mask, (gray.shape[1], gray.shape[0]),
                      interpolation=cv2.INTER_NEAREST)

    return mask
