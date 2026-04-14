# new_pipeline/stage7_classification/classify.py

import torch
import numpy as np
import json
import os
import requests
from huggingface_hub import hf_hub_download

HF_TOKEN = os.getenv("HF_TOKEN", "")
REPO_ID  = "Ashish4816/ecg-model"

# ── Model architecture (same as training) ────────────────────────────────────
import torch.nn as nn

class SEBlock1D(nn.Module):
    def __init__(self,ch,reduction=16):
        super().__init__()
        self.se=nn.Sequential(nn.AdaptiveAvgPool1d(1),nn.Flatten(),
            nn.Linear(ch,ch//reduction,bias=False),nn.GELU(),
            nn.Linear(ch//reduction,ch,bias=False),nn.Sigmoid())
    def forward(self,x): return x*self.se(x).unsqueeze(-1)

class ResBlock1D(nn.Module):
    def __init__(self,ch,kernel=9,dilation=1):
        super().__init__()
        pad=(kernel-1)*dilation//2
        self.net=nn.Sequential(
            nn.Conv1d(ch,ch,kernel,padding=pad,dilation=dilation,bias=False),
            nn.BatchNorm1d(ch),nn.GELU(),
            nn.Conv1d(ch,ch,kernel,padding=pad,dilation=dilation,bias=False),
            nn.BatchNorm1d(ch))
        self.se=SEBlock1D(ch); self.act=nn.GELU()
    def forward(self,x): return self.act(x+self.se(self.net(x)))

class MultiScaleBlock(nn.Module):
    def __init__(self,in_ch,out_ch):
        super().__init__()
        mid=out_ch//4
        self.b1=nn.Sequential(nn.Conv1d(in_ch,mid,3,padding=1,bias=False),nn.BatchNorm1d(mid),nn.GELU())
        self.b2=nn.Sequential(nn.Conv1d(in_ch,mid,7,padding=3,bias=False),nn.BatchNorm1d(mid),nn.GELU())
        self.b3=nn.Sequential(nn.Conv1d(in_ch,mid,15,padding=7,bias=False),nn.BatchNorm1d(mid),nn.GELU())
        self.b4=nn.Sequential(nn.Conv1d(in_ch,mid,31,padding=15,bias=False),nn.BatchNorm1d(mid),nn.GELU())
        self.proj=nn.Sequential(nn.Conv1d(out_ch,out_ch,1,bias=False),nn.BatchNorm1d(out_ch),nn.GELU())
    def forward(self,x): return self.proj(torch.cat([self.b1(x),self.b2(x),self.b3(x),self.b4(x)],dim=1))

class DilatedBlock(nn.Module):
    def __init__(self,ch):
        super().__init__()
        self.d1=ResBlock1D(ch,9,1); self.d2=ResBlock1D(ch,9,2)
        self.d4=ResBlock1D(ch,9,4); self.d8=ResBlock1D(ch,9,8)
    def forward(self,x): return self.d8(self.d4(self.d2(self.d1(x))))

class ECGClassifier(nn.Module):
    def __init__(self,n_diag=44,n_rhythm=12):
        super().__init__()
        self.stem=nn.Sequential(
            nn.Conv1d(12,64,15,padding=7,bias=False),nn.BatchNorm1d(64),nn.GELU(),
            nn.Conv1d(64,64,15,padding=7,bias=False),nn.BatchNorm1d(64),nn.GELU())
        self.stage1=nn.Sequential(MultiScaleBlock(64,128),ResBlock1D(128,9),ResBlock1D(128,9),nn.MaxPool1d(2))
        self.stage2=nn.Sequential(MultiScaleBlock(128,256),ResBlock1D(256,7),ResBlock1D(256,7),nn.MaxPool1d(2))
        self.stage3=nn.Sequential(MultiScaleBlock(256,512),ResBlock1D(512,5),ResBlock1D(512,5),nn.MaxPool1d(2))
        self.stage4=nn.Sequential(MultiScaleBlock(512,512),ResBlock1D(512,5),ResBlock1D(512,5),nn.MaxPool1d(2))
        self.stage5=DilatedBlock(512)
        self.avg_pool=nn.AdaptiveAvgPool1d(1); self.max_pool=nn.AdaptiveMaxPool1d(1)
        self.proj=nn.Sequential(nn.Flatten(),nn.Linear(1024,512),nn.GELU(),nn.Dropout(0.3))
        self.diag_head=nn.Sequential(nn.Linear(512,256),nn.GELU(),nn.Dropout(0.4),
            nn.Linear(256,128),nn.GELU(),nn.Dropout(0.3),nn.Linear(128,n_diag))
        self.rhythm_head=nn.Sequential(nn.Linear(512,128),nn.GELU(),nn.Dropout(0.4),
            nn.Linear(128,64),nn.GELU(),nn.Dropout(0.3),nn.Linear(64,n_rhythm))

    def forward(self,x):
        x=self.stem(x); x=self.stage1(x); x=self.stage2(x)
        x=self.stage3(x); x=self.stage4(x); x=self.stage5(x)
        feat=torch.cat([self.avg_pool(x).squeeze(-1),
                        self.max_pool(x).squeeze(-1)],dim=1)
        feat=self.proj(feat)
        return self.diag_head(feat),self.rhythm_head(feat)

# ── Singleton loader ──────────────────────────────────────────────────────────
class ECGClassifierService:
    _instance = None

    @classmethod
    def get(cls):
        if cls._instance is None:
            cls._instance = cls._load()
        return cls._instance

    @classmethod
    def _load(cls):
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # Download from HF
        local_path = "/tmp/ecg_classifier.pth"
        if not os.path.exists(local_path):
            print("Downloading ecg_classifier.pth from HF...")
            url = f"https://huggingface.co/{REPO_ID}/resolve/main/ecg_classifier.pth"
            headers = {"Authorization": f"Bearer {HF_TOKEN}"}
            r = requests.get(url, headers=headers, stream=True)
            r.raise_for_status()
            with open(local_path, 'wb') as f:
                for chunk in r.iter_content(8192):
                    f.write(chunk)
            print("✅ Downloaded!")

        ckpt = torch.load(local_path, map_location=device)
        diag_classes   = ckpt.get('diag_classes', [])
        rhythm_classes = ckpt.get('rhythm_classes', [])

        model = ECGClassifier(
            n_diag=len(diag_classes),
            n_rhythm=len(rhythm_classes)
        ).to(device)

        state = {k.replace('module.',''):v
                 for k,v in ckpt['model_state_dict'].items()}
        model.load_state_dict(state)
        model.eval()

        print(f"✅ ECGClassifier loaded | "
              f"Diag: {len(diag_classes)} | Rhythm: {len(rhythm_classes)}")

        return {
            'model': model,
            'device': device,
            'diag_classes': diag_classes,
            'rhythm_classes': rhythm_classes
        }

    @classmethod
    def predict(cls, ecg_signal, threshold=0.5):
        """
        ecg_signal: numpy array (12, 5000)
        returns: dict with diagnoses and rhythms
        """
        svc    = cls.get()
        model  = svc['model']
        device = svc['device']

        # Normalize
        mean = ecg_signal.mean(axis=1, keepdims=True)
        std  = ecg_signal.std(axis=1,  keepdims=True) + 1e-8
        sig  = (ecg_signal - mean) / std

        x = torch.from_numpy(sig).float().unsqueeze(0).to(device)

        with torch.no_grad():
            d_logits, r_logits = model(x)
            d_probs = torch.sigmoid(d_logits)[0].cpu().numpy()
            r_probs = torch.sigmoid(r_logits)[0].cpu().numpy()

        diagnoses = [
            {"code": svc['diag_classes'][i],
             "probability": float(d_probs[i])}
            for i in range(len(svc['diag_classes']))
            if d_probs[i] >= threshold
        ]
        rhythms = [
            {"code": svc['rhythm_classes'][i],
             "probability": float(r_probs[i])}
            for i in range(len(svc['rhythm_classes']))
            if r_probs[i] >= threshold
        ]

        diagnoses.sort(key=lambda x: -x['probability'])
        rhythms.sort(key=lambda x:   -x['probability'])

        return {
            "diagnoses": diagnoses,
            "rhythms":   rhythms,
            "top_diagnosis": diagnoses[0] if diagnoses else None,
        }