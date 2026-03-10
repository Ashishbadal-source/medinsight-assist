# 🫀 MedInsight AI — ECG Analysis Platform

> An intelligent, full-stack medical analysis platform powered by deep learning for accurate ECG interpretation and cardiac diagnosis assistance.

**Live App:** [medinsight-assist.vercel.app](https://medinsight-assist.vercel.app)  
**Backend API:** [Ashish4816-medinsight-backend.hf.space](https://Ashish4816-medinsight-backend.hf.space)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [ECG Pipeline](#ecg-pipeline)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)

---

## 🧠 Overview

MedInsight AI is a full-stack web application that allows users to upload ECG images and receive AI-powered cardiac analysis. The platform uses a multi-stage machine learning pipeline — from waveform segmentation to deep learning inference — to identify cardiac conditions such as Myocardial Infarction (MI), ST/T-wave changes (STTC), Conduction Disorders (CD), Hypertrophy (HYP), and Normal rhythm (NORM).

---

## ✨ Features

- 📤 **ECG Image Upload** — Upload ECG scans directly from the browser
- 🔬 **AI-Powered Analysis** — Multi-label cardiac condition detection
- 📊 **Confidence Scores** — Per-class probability output for each diagnosis
- 🔐 **Secure Auth** — JWT-based authentication via Supabase
- 📱 **Responsive UI** — Works on desktop and mobile
- ⚡ **Fast Inference** — Optimized ONNX model for low-latency predictions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React + Vite | UI framework & build tool |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Supabase JS | Auth client |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API framework |
| Python 3.11 | Runtime |
| ONNX Runtime | Model inference |
| OpenCV | ECG image preprocessing |
| scikit-image | Waveform segmentation |
| Supabase JWT | Auth verification |

### ML / AI
| Technology | Purpose |
|------------|---------|
| EfficientNet-B0 | Primary classification model |
| PyTorch | Model training |
| PTB-XL Dataset | Training data (21,799 ECG records) |
| ONNX | Model export format |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| HuggingFace Spaces | Backend hosting |
| Supabase | Auth & database |
| GitHub | Version control |
| Git LFS | Large model file tracking |

---

## 🏗 Architecture

```
User Browser
     │
     ▼
┌─────────────────┐         ┌──────────────────────────┐
│   React Frontend │ ──JWT──▶│     FastAPI Backend       │
│  (Vercel)        │◀────────│  (HuggingFace Spaces)     │
└─────────────────┘         └──────────┬───────────────┘
                                        │
                             ┌──────────▼───────────┐
                             │    ECG ML Pipeline    │
                             │                       │
                             │  1. Image Upload       │
                             │  2. Preprocessing      │
                             │  3. Otsu Segmentation  │
                             │  4. Signal Extraction  │
                             │  5. ONNX Inference     │
                             │  6. Results JSON       │
                             └──────────────────────┘
```

---

## 🔬 ECG Pipeline

The core ML pipeline processes uploaded ECG images through multiple stages:

```
ECG Image
    │
    ▼
┌─────────────────────┐
│  Preprocessing       │  → Grayscale, resize, normalize
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Otsu Thresholding   │  → Isolate waveform from background
│  (OpenCV)            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Signal Extraction   │  → Convert mask to 1D signal per lead
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  EfficientNet-B0     │  → 5-class multi-label classification
│  (ONNX Runtime)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Results             │  → NORM / MI / STTC / CD / HYP
│  + Confidence Scores │     with probability per class
└─────────────────────┘
```

**Output Classes:**
| Label | Condition |
|-------|-----------|
| NORM | Normal Rhythm |
| MI | Myocardial Infarction |
| STTC | ST/T-wave Changes |
| CD | Conduction Disorder |
| HYP | Hypertrophy |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git LFS installed

### Frontend Setup

```bash
# Step 1: Clone the repository
git clone https://github.com/Ashishbadal-source/medinsight-assist.git

# Step 2: Navigate to project directory
cd medinsight-assist

# Step 3: Install dependencies
npm install

# Step 4: Start development server
npm run dev
```

App will run at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend
cd medinsight-backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

API will run at `http://localhost:8000`

---

## 🔑 Environment Variables

### Frontend (`.env`)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=https://Ashish4816-medinsight-backend.hf.space
```

### Backend (HuggingFace Space Variables)
```env
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
# Auto-deploys on push to main branch
git push origin main
```

### Backend → HuggingFace Spaces
```bash
# Add HuggingFace remote
git remote add hf https://huggingface.co/spaces/Ashish4816/medinsight-backend

# Push to HuggingFace
git push hf main
```

> **Note:** Large model files (`.onnx`, `.pth`) are tracked via Git LFS. Ensure LFS is installed before cloning.

---

## 📡 API Reference

### `POST /analyze`
Upload an ECG image for analysis.

**Headers:**
```
Authorization: Bearer <supabase_jwt_token>
Content-Type: multipart/form-data
```

**Request:**
```
file: <ECG image file>
```

**Response:**
```json
{
  "predictions": {
    "NORM": 0.82,
    "MI": 0.12,
    "STTC": 0.05,
    "CD": 0.03,
    "HYP": 0.01
  },
  "top_condition": "NORM"
}
```

### `GET /health`
Check API status.

### `GET /debug`
Verify environment variable loading (dev only).

---

## 🗺 Roadmap

- [x] ECG image upload & preprocessing
- [x] Waveform segmentation (OpenCV Otsu)
- [x] JWT authentication (Supabase)
- [x] HuggingFace Spaces deployment
- [x] EfficientNet-B0 training on PTB-XL (21,799 records)
- [ ] ONNX model integration in backend
- [ ] Report generation (PDF export)
- [ ] Multi-lead visualization
- [ ] Doctor dashboard
- [ ] Mobile app (React Native)

---

## ⚠️ Disclaimer

MedInsight AI is an **assistive tool only** and is **not a substitute for professional medical advice**. Always consult a qualified cardiologist for diagnosis and treatment decisions.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">Thank you</p>
