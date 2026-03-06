# import numpy as np
# import torch

# def prepare_ml_input(ecg):
#     """
#     ecg: numpy (12, 5000)
#     returns: torch tensor (1, 12, 5000)
#     """

#     x = torch.from_numpy(ecg).float()
#     x = x.unsqueeze(0)  # batch dimension
#     return x


import numpy as np

def prepare_ml_input(ecg):
    """
    ecg: numpy (5000, 12)
    returns: numpy (1, 5000, 12)
    """
    x = np.expand_dims(ecg, axis=0)  # (1, 5000, 12)
    return x