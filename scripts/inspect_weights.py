import torch
ckpt = torch.load('weights/ecg_classifier.pth', map_location='cpu')
state = ckpt.get('model_state_dict', ckpt)
for k in list(state.keys())[:50]:
    print(k)
if len(state.keys()) > 50:
    print(f"... and {len(state.keys())-50} more keys.")
