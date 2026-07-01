# Glaucoma Detection System — Master Guide

**Everything in one place.** Use this document to find any file, script, endpoint, or instruction in the project.

| | |
|---|---|
| **Project root** | `GLAUCOMA/` |
| **Last updated** | June 12, 2026 |
| **Status** | Full-stack — frontend + FastAPI + AI + PDF |

---

## Table of Contents

1. [How to Run (Start Here)](#1-how-to-run-start-here)
2. [Complete Folder Map](#2-complete-folder-map)
3. [All Documentation Files](#3-all-documentation-files)
4. [All Scripts & Launchers](#4-all-scripts--launchers)
5. [Backend — FastAPI (Canonical)](#5-backend--fastapi-canonical)
6. [AI Pipeline — Source Files](#6-ai-pipeline--source-files)
7. [Frontend — React App](#7-frontend--react-app)
8. [API Reference](#8-api-reference)
9. [Model & Outputs](#9-model--outputs)
10. [Tests](#10-tests)
11. [Docker & Deployment](#11-docker--deployment)
12. [User Workflow (Step by Step)](#12-user-workflow-step-by-step)
13. [Recent Changes Summary](#13-recent-changes-summary)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. How to Run (Start Here)

### Fastest way — one command

```powershell
cd GLAUCOMA
.\start.ps1
```

Or double-click: **`start.bat`**

| What starts | URL |
|---------------|-----|
| React frontend | http://localhost:5173 |
| FastAPI backend | http://localhost:8000 |
| API docs (Swagger) | http://localhost:8000/docs |

### First-time setup (once only)

```powershell
# 1. Python virtual environment
python -m venv .venv
.\.venv\Scripts\pip install -r glaucoma_project\requirements.txt

# 2. Frontend dependencies
cd glaucoma-app
npm install
cd ..

# 3. Verify model exists
# Must exist: glaucoma_project\outputs\models\best_model.pth
```

### Manual start (two terminals)

| Terminal | Command | Folder |
|----------|---------|--------|
| 1 — API | `run_api.bat` or `python -m uvicorn src.api:app --host 0.0.0.0 --port 8000` | `glaucoma_project/` |
| 2 — UI | `npm run dev` | `glaucoma-app/` |

---

## 2. Complete Folder Map

```
GLAUCOMA/                                    ← PROJECT ROOT
│
├── README.md                               ← Main project overview
├── MASTER_GUIDE.md                         ← THIS FILE (everything in one place)
├── start.ps1                               ← One-click start (API + frontend)
├── start.bat                               ← Double-click launcher
├── ARCHITECTURE.md                         ← System diagrams
├── DEPLOYMENT.md                           ← Production & Docker
├── TEST_REPORT.md                          ← Test results
├── AUDIT_REPORT.md                         ← Integration audit
├── README_LONG_PATHS.md                    ← Windows long-path fix notes
├── docker-compose.yml                      ← Docker: API + frontend
├── .venv/                                  ← Python virtual environment (root)
│
├── glaucoma_project/                       ← AI + BACKEND (Python)
│   ├── README.md                           ← ML pipeline & training docs
│   ├── API_INSTRUCTIONS.md                 ← API reference
│   ├── SETUP_GUIDE.md                      ← Environment setup
│   ├── TRAINING_INSTRUCTIONS.md            ← How to train the model
│   ├── requirements.txt                    ← Python dependencies
│   ├── pyproject.toml                      ← Python package config
│   ├── Dockerfile                          ← API container image
│   ├── run_api.bat / run_api.ps1           ← Start FastAPI only
│   ├── run_training.bat / run_training.ps1 ← Train ResNet-50
│   ├── fix_long_paths.bat                  ← Windows path fix
│   ├── reinstall_deps.bat                  ← Reinstall Python deps
│   │
│   ├── src/                                ← ALL SOURCE CODE
│   │   ├── api.py                          ← ★ FastAPI backend (canonical)
│   │   ├── prediction_service.py           ← ★ Inference orchestration
│   │   ├── pdf_service.py                  ← ★ Medical PDF reports
│   │   ├── preprocessing.py                ← Green channel, CLAHE, Gaussian
│   │   ├── segmentation.py                 ← K-Strange disc/cup segmentation
│   │   ├── cdr.py                          ← Cup-to-disc ratio
│   │   ├── model.py                        ← ResNet-50 architecture
│   │   ├── predict.py                      ← CLI prediction pipeline
│   │   ├── pipeline.py                     ← End-to-end CLI runner
│   │   ├── inference.py                    ← Model inference helper
│   │   ├── evaluate.py                     ← Test-set evaluation
│   │   ├── train.py                        ← Training script
│   │   ├── train_optimized.py              ← Optimized training
│   │   ├── dataset.py                      ← PyTorch DataLoader
│   │   ├── config.py                       ← Configuration
│   │   ├── error_handler.py                ← Logging & validation
│   │   └── aggregate_results.py            ← Batch result aggregation
│   │
│   ├── outputs/
│   │   ├── models/
│   │   │   ├── best_model.pth              ← ★ Active model weights
│   │   │   └── best_model_optimized.pth    ← Alternate trained model
│   │   ├── reports/                        ← Generated PDF reports (API)
│   │   ├── results/                        ← Pipeline output images
│   │   ├── plots/                          ← Training plots
│   │   └── logs/                           ← Log files
│   │
│   ├── dataset/                            ← Training/val/test images
│   │   ├── train/
│   │   ├── val/
│   │   └── test/
│   │
│   ├── tests/
│   │   ├── test_suite.py                   ← ML module unit tests
│   │   └── test_api_integration.py         ← ★ FastAPI end-to-end tests
│   │
│   ├── notebooks/                          ← Jupyter notebooks (research)
│   └── generate_comprehensive_report.py    ← 50-page Word project report
│   └── generate_ieee_report.py             ← IEEE Word technical paper
│
└── glaucoma-app/                           ← FRONTEND (React)
    ├── README.md                           ← Frontend docs
    ├── package.json                        ← Node dependencies
    ├── vite.config.js                      ← Dev server + API proxy → :8000
    ├── nginx.conf                          ← Production reverse proxy
    ├── Dockerfile                          ← Frontend container image
    ├── .env.example                        ← Environment variable template
    │
    ├── src/
    │   ├── main.jsx                        ← React entry point
    │   ├── App.jsx                         ← Router (/, /upload, /results)
    │   ├── index.css                       ← Tailwind styles
    │   ├── api/
    │   │   └── client.js                   ← ★ FastAPI HTTP client
    │   ├── pages/
    │   │   ├── Landing.jsx                 ← Home page
    │   │   ├── Upload.jsx                  ← Image upload + analysis
    │   │   └── Results.jsx                 ← Results dashboard + PDF
    │   └── components/
    │       └── Layout.jsx                  ← Header, nav, footer
    │
    ├── dist/                               ← Production build output
    │
    └── flask-api/                          ← ⚠ DEPRECATED (do not use)
        └── DEPRECATED.md                   ← Points to FastAPI backend
```

**★ = critical files for the live application**

---

## 3. All Documentation Files

| File | Location | What it covers |
|------|----------|----------------|
| **MASTER_GUIDE.md** | `GLAUCOMA/` | This file — complete project map |
| **README.md** | `GLAUCOMA/` | Main overview, quick start, architecture |
| **ARCHITECTURE.md** | `GLAUCOMA/` | System diagrams, API flow, schema |
| **DEPLOYMENT.md** | `GLAUCOMA/` | Production build, Docker, env vars |
| **TEST_REPORT.md** | `GLAUCOMA/` | Integration test results |
| **AUDIT_REPORT.md** | `GLAUCOMA/` | Full project audit & connection status |
| **README_LONG_PATHS.md** | `GLAUCOMA/` | Windows long-path workarounds |
| **README.md** | `glaucoma_project/` | ML pipeline, training, model metrics |
| **API_INSTRUCTIONS.md** | `glaucoma_project/` | FastAPI endpoints, curl examples |
| **SETUP_GUIDE.md** | `glaucoma_project/` | Python environment setup |
| **TRAINING_INSTRUCTIONS.md** | `glaucoma_project/` | How to train ResNet-50 |
| **README.md** | `glaucoma-app/` | Frontend setup & pages |
| **DEPRECATED.md** | `glaucoma-app/flask-api/` | Old Flask backend (removed) |

---

## 4. All Scripts & Launchers

| Script | Location | What it does |
|--------|----------|--------------|
| **start.ps1** | `GLAUCOMA/` | ★ Start API + frontend + open browser |
| **start.bat** | `GLAUCOMA/` | ★ Double-click wrapper for start.ps1 |
| **run_api.bat** | `glaucoma_project/` | Start FastAPI only (port 8000) |
| **run_api.ps1** | `glaucoma_project/` | Same as above (PowerShell) |
| **run_training.bat** | `glaucoma_project/` | Train the ResNet-50 model |
| **run_training.ps1** | `glaucoma_project/` | Same as above (PowerShell) |
| **fix_long_paths.bat** | `glaucoma_project/` | Fix Windows path length issues |
| **reinstall_deps.bat** | `glaucoma_project/` | Reinstall Python packages |

---

## 5. Backend — FastAPI (Canonical)

**Only one backend.** All requests go here.

| Item | Value |
|------|-------|
| File | `glaucoma_project/src/api.py` |
| Port | **8000** |
| Framework | FastAPI + Uvicorn |
| Start | `run_api.bat` or `start.ps1` |

### Supporting modules

| Module | File | Role |
|--------|------|------|
| Inference | `prediction_service.py` | Runs full AI pipeline, returns JSON + images |
| PDF | `pdf_service.py` | Generates hospital-style PDF reports |
| Config | `config.py` | Paths, device, directories |

### Data flow

```
POST /predict
  → api.py
  → prediction_service.py
      → preprocessing.py
      → segmentation.py (K-Strange)
      → cdr.py
      → model.py (ResNet-50)
  → pdf_service.py → outputs/reports/{report_id}.pdf
  → JSON response to frontend
```

---

## 6. AI Pipeline — Source Files

| Stage | File | Key functions |
|-------|------|---------------|
| 1. Preprocessing | `src/preprocessing.py` | `preprocess_image()` — green channel, CLAHE, Gaussian |
| 2. Disc localization | `src/segmentation.py` | `detect_optic_disc_roi()` |
| 3. Segmentation | `src/segmentation.py` | `segment_disc_and_cup()` — K-Strange clustering |
| 4. CDR | `src/cdr.py` | `compute_cdr()`, `interpret_cdr()` |
| 5. CNN | `src/model.py` | `create_resnet50_model()` |
| 6. Risk & recommendations | `src/prediction_service.py` | `compute_risk_level()`, `build_recommendations()` |
| 7. PDF report | `src/pdf_service.py` | `generate_medical_pdf()` |

### Model weights

| File | Purpose |
|------|---------|
| `outputs/models/best_model.pth` | **Active model** used by API |
| `outputs/models/best_model_optimized.pth` | Alternate trained weights |

### CLI tools (without API)

| Command | File | Purpose |
|---------|------|---------|
| `python src/pipeline.py` | `pipeline.py` | Run pipeline on one image |
| `python src/predict.py` | `predict.py` | Single-image prediction |
| `python src/evaluate.py` | `evaluate.py` | Evaluate on test set |
| `python src/train_optimized.py` | `train_optimized.py` | Train model |

---

## 7. Frontend — React App

| Item | Value |
|------|-------|
| Folder | `glaucoma-app/` |
| Port | **5173** |
| Framework | React 18 + Vite + Tailwind CSS |
| Start | `npm run dev` or `start.ps1` |

### Pages

| URL | File | Purpose |
|-----|------|---------|
| `/` | `src/pages/Landing.jsx` | Home, features, how it works |
| `/upload` | `src/pages/Upload.jsx` | Upload fundus image, patient form |
| `/results` | `src/pages/Results.jsx` | Diagnosis, charts, images, PDF download |

### API client

| File | Purpose |
|------|---------|
| `src/api/client.js` | `predictImage()`, `checkHealth()`, `b64Image()` |
| `vite.config.js` | Proxies `/predict`, `/health`, `/reports` → port 8000 |

---

## 8. API Reference

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Server + model status |
| GET | `/` | Same as health |
| POST | `/predict` | Upload image, run full pipeline |
| GET | `/reports/{report_id}.pdf` | Download PDF report |
| GET | `/docs` | Swagger UI |
| GET | `/redoc` | ReDoc documentation |

### POST /predict

**Form fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `file` | Yes | Fundus image (JPG, PNG, BMP, TIFF) |
| `patient_name` | No | For PDF report |
| `patient_age` | No | For PDF report |
| `patient_id` | No | For PDF report |

**Response (key fields):**

```json
{
  "report_id": "GLC-XXXXXXXX",
  "prediction": "Normal",
  "confidence_score": 87.5,
  "cup_disc_ratio": 0.4521,
  "risk_level": "Low",
  "segmentation_images": { "original", "optic_disc", "optic_cup", "segmentation", "vessels" },
  "heatmap_image": "<base64>",
  "recommendations": ["..."],
  "pdf_url": "http://localhost:8000/reports/GLC-XXXXXXXX.pdf"
}
```

---

## 9. Model & Outputs

### Generated at runtime (API)

| Path | Content |
|------|---------|
| `outputs/reports/*.pdf` | Patient PDF reports |
| `outputs/results/{job_id}/` | Stage images per analysis |

### Training outputs

| Path | Content |
|------|---------|
| `outputs/models/best_model.pth` | Trained weights |
| `outputs/plots/` | Training history charts |
| `outputs/training_results/` | JSON metrics |

---

## 10. Tests

```powershell
cd glaucoma_project
..\.venv\Scripts\python.exe -m pytest tests/test_api_integration.py -v
..\.venv\Scripts\python.exe -m pytest tests/test_suite.py -v
```

| Test file | What it tests |
|-----------|---------------|
| `tests/test_api_integration.py` | FastAPI health, predict, PDF download |
| `tests/test_suite.py` | ML modules, config, preprocessing, CDR |

---

## 11. Docker & Deployment

```bash
docker compose up --build
```

| Service | Port | Config |
|---------|------|--------|
| api | 8000 | `glaucoma_project/Dockerfile` |
| frontend | 5173 | `glaucoma-app/Dockerfile` + `nginx.conf` |

See **DEPLOYMENT.md** for full production guide.

---

## 12. User Workflow (Step by Step)

```
1. Run start.ps1 (or start.bat)
        ↓
2. Browser opens → http://localhost:5173
        ↓
3. Click "Start Analysis" or go to /upload
        ↓
4. Enter patient details (optional)
        ↓
5. Drag & drop fundus image (JPG/PNG)
        ↓
6. Click "Analyse Fundus Image"
        ↓
7. Frontend → POST /predict → FastAPI
        ↓
8. AI pipeline runs (~30–120 sec first time on CPU)
        ↓
9. Results page shows:
   - Diagnosis (Glaucoma / Normal)
   - Confidence, CDR, Risk level
   - Image tabs (original, disc, cup, heatmap)
   - Recommendations
        ↓
10. Click "Download PDF" → GET /reports/{id}.pdf
```

---

## 13. Recent Changes Summary

| Date | Change |
|------|--------|
| Jun 2026 | Single canonical FastAPI backend (`src/api.py`) |
| Jun 2026 | Flask wrapper removed (`flask-api/` deprecated) |
| Jun 2026 | `prediction_service.py` — single inference source |
| Jun 2026 | `pdf_service.py` — server-side medical PDFs |
| Jun 2026 | React frontend: Landing, Upload, Results pages |
| Jun 2026 | Full API response: images, heatmap, risk, PDF URL |
| Jun 2026 | `start.ps1` / `start.bat` — one-command launcher |
| Jun 2026 | Integration tests: `test_api_integration.py` |
| Jun 2026 | Docker compose for API + frontend |

---

## 14. Troubleshooting

| Problem | Solution |
|---------|----------|
| `start.ps1` fails — no Python | Run `python -m venv .venv` then install requirements |
| `start.ps1` fails — no npm | Install Node.js 18+ from nodejs.org |
| API not responding | Check model exists: `outputs/models/best_model.pth` |
| Frontend shows connection error | Ensure API is running on port 8000 |
| 422 on upload | Use field name `file`, not `image` |
| Slow first prediction | Model loads on first request (~60–120s CPU) |
| PDF 404 | Use `pdf_url` from the predict response |
| CORS errors in dev | Use Vite proxy (don't set `VITE_API_URL`) |
| Windows long paths | See `README_LONG_PATHS.md`, run `fix_long_paths.bat` |

---

## Quick Links

| I want to… | Go to |
|------------|-------|
| **Run the whole app** | `.\start.ps1` |
| **Understand architecture** | [ARCHITECTURE.md](ARCHITECTURE.md) |
| **API details** | [glaucoma_project/API_INSTRUCTIONS.md](glaucoma_project/API_INSTRUCTIONS.md) |
| **Train the model** | [glaucoma_project/TRAINING_INSTRUCTIONS.md](glaucoma_project/TRAINING_INSTRUCTIONS.md) |
| **Deploy to production** | [DEPLOYMENT.md](DEPLOYMENT.md) |
| **See test results** | [TEST_REPORT.md](TEST_REPORT.md) |
| **Read project audit** | [AUDIT_REPORT.md](AUDIT_REPORT.md) |

---

**MITE — Information Science & Engineering · Academic Project 2025–26**
