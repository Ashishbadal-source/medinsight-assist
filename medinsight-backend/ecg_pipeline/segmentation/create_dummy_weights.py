import torch
from unet import UNet

model = UNet(in_channels=1, out_channels=1)
torch.save(model.state_dict(), "weights.pth")

print("Dummy weights.pth created")
