import numpy as np

ecg = np.load("ecg_signal.npy")

print("Shape:", ecg.shape)

for i in range(12):
    print(
        f"Lead {i+1}: "
        f"min={ecg[i].min():.3f}, "
        f"max={ecg[i].max():.3f}, "
        f"ptp={np.ptp(ecg[i]):.3f}"
    )
