# Glaucoma Detection System

**End-to-end AI-powered glaucoma screening from retinal fundus images.**

| | |
|---|---|
| **Status** | Production-ready full-stack integration |
| **Last updated** | June 12, 2026 |
| **Stack** | React + FastAPI + ResNet-50 + K-Strange segmentation |

---

## What This Project Does

Upload a fundus photograph → AI analyzes optic disc/cup → returns glaucoma prediction, CDR, full pipeline visuals (preprocessing, segmentation, CDR charts, diagnostic composite), and a downloadable **PDF medical report**.

---

## Quick Start (One Command)

From the **`GLUCOMA`** folder root:

```powershell
powershell -ExecutionPolicy Bypass -File START_PROJECT.ps1
```

Or shorter:

```powershell
.\START_PROJECT.ps1
```

Or double-click **`start.bat`**.

This automatically:
1. Starts **FastAPI** on http://localhost:8000
2. Starts **React frontend** on http://localhost:5173
3. Opens your browser

Press **Ctrl+C** in each terminal window to stop.

### First-time setup

```powershell
# Python environment
python -m venv .venv
.\.venv\Scripts\pip install -r glaucoma_project\requirements.txt

# Frontend
cd glaucoma-app
npm install
cd ..
```

Ensure model weights exist at:
`glaucoma_project/outputs/models/best_model.pth`

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  glaucoma-app/          React frontend (:5173)              │
│    Landing → Upload → Results → PDF download                │
└────────────────────────────┬────────────────────────────────┘
                             │ POST /predict  (field: file)
                             │ GET  /reports/{id}.pdf
┌────────────────────────────▼────────────────────────────────┐
│  glaucoma_project/src/api.py    FastAPI (:8000)             │
│    prediction_service.py  →  AI pipeline                     │
│    pdf_service.py         →  PDF reports                    │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
 preprocessing.py    segmentation.py         model.py
 (CLAHE, Gaussian)   (K-Strange disc/cup)   (ResNet-50)
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ▼
                        cdr.py (CDR + risk)
                             ▼
                   outputs/reports/*.pdf
```

**Single canonical backend:** `glaucoma_project/src/api.py`  
No separate Flask server — the old `glaucoma-app/flask-api/` wrapper has been removed.

---

## Repository Layout

```
GLUCOMA/
├── start.ps1 / start.bat       ← One-click launcher (API + frontend)
├── README.md                   ← This file
├── ARCHITECTURE.md             ← Detailed architecture diagram
├── DEPLOYMENT.md               ← Production & Docker guide
├── TEST_REPORT.md              ← Integration test results
├── AUDIT_REPORT.md             ← Full project audit
├── docker-compose.yml
│
├── glaucoma_project/           ← AI + Backend (Python)
│   ├── src/
│   │   ├── api.py              ← FastAPI (canonical backend)
│   │   ├── prediction_service.py
│   │   ├── pdf_service.py
│   │   ├── preprocessing.py
│   │   ├── segmentation.py     ← K-Strange clustering
│   │   ├── cdr.py
│   │   ├── model.py            ← ResNet-50
│   │   ├── predict.py
│   │   └── pipeline.py
│   ├── outputs/models/best_model.pth
│   ├── run_api.bat / run_api.ps1
│   ├── API_INSTRUCTIONS.md
│   └── README.md
│
└── glaucoma-app/               ← Frontend (React + Vite)
    ├── src/pages/              Landing, Upload, Results
    ├── src/api/client.js       FastAPI client
    └── README.md
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Server and model status |
| POST | `/predict` | Upload fundus image (`file` field) |
| GET | `/results/{job_id}` | Reload full analysis with pipeline images |
| GET | `/reports/{report_id}.pdf` | Download PDF report |
| GET | `/eval/{filename}` | Model evaluation plots (ROC, confusion matrix) |
| GET | `/docs` | Swagger UI |

### Example

```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@fundus.jpg" \
  -F "patient_name=John Doe" \
  -F "patient_age=45" \
  -F "patient_id=P001"
```

### Response includes

- `prediction` — Glaucoma / Normal
- `confidence_score` — 0–100%
- `cup_disc_ratio` — CDR value
- `risk_level` — Low / Medium / High
- `segmentation_images` — base64 disc/cup overlay on fundus
- `preprocessing_image` — 5-stage preprocessing panel
- `segmentation_panel_image` — K-Strange 4-panel segmentation
- `cdr_report_image` — CDR bar chart + clinical report
- `pipeline_summary_image` — 3-panel pipeline summary
- `final_composite_image` — complete 12-panel diagnostic output
- `recommendations` — clinical guidance
- `pdf_url` — link to generated report
- `job_id` — use `GET /results/{job_id}` to reload full results

---

## Manual Start (Two Terminals)

**Terminal 1 — API:**
```powershell
cd glaucoma_project
..\.venv\Scripts\python.exe -m uvicorn src.api:app --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**
```powershell
cd glaucoma-app
npm run dev
```

Open http://localhost:5173

---

## User Workflow

1. **Landing page** — project overview and features
2. **Upload** — drag & drop fundus image (JPG/PNG), optional patient details
3. **Analysis** — AI pipeline runs (preprocess → segment → CDR → ResNet-50)
4. **Results** — diagnosis, confidence, CDR, risk level, image tabs, charts
5. **PDF** — download hospital-style screening report

---

## AI Pipeline (7 Stages)

1. Image loading & preprocessing (green channel, CLAHE, Gaussian)
2. ROI extraction & normalization
3. K-Strange segmentation (disc vs background, cup vs disc)
4. CDR calculation (vertical cup-to-disc ratio)
5. ResNet-50 CNN inference
6. Risk stratification & recommendations
7. PDF report generation

**Model:** ResNet-50 with transfer learning · **Test accuracy:** ~89.3%

---

## Testing

```powershell
cd glaucoma_project
..\.venv\Scripts\python.exe -m pytest tests/test_api_integration.py -v
```

---

## Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:8000

---

## Recent Changes (June 2026)

| Change | Details |
|--------|---------|
| **Canonical FastAPI backend** | Single backend in `glaucoma_project/src/api.py` |
| **Flask removed** | `glaucoma-app/flask-api/` deprecated — no duplicate server |
| **Frontend integrated** | React app connects directly to FastAPI on port 8000 |
| **PDF in API** | Server-side medical reports via `pdf_service.py` |
| **prediction_service.py** | Single source of truth for inference orchestration |
| **One-start launcher** | `start.ps1` / `start.bat` runs API + frontend together |
| **UI redesign** | Landing, Upload, Results pages with Tailwind CSS |
| **Full pipeline outputs** | Preprocessing, segmentation, CDR, composite panels in UI + PDF |
| **Results API** | `GET /results/{job_id}` reloads images from disk (no sessionStorage limits) |
| **Integration tests** | `tests/test_api_integration.py` — end-to-end verified |

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| **[MASTER_GUIDE.md](MASTER_GUIDE.md)** | **★ Everything in one place — start here for full map** |
| [glaucoma_project/README.md](glaucoma_project/README.md) | ML pipeline, training, model details |
| [glaucoma_project/API_INSTRUCTIONS.md](glaucoma_project/API_INSTRUCTIONS.md) | API reference |
| [glaucoma-app/README.md](glaucoma-app/README.md) | Frontend setup |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagrams |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment |
| [TEST_REPORT.md](TEST_REPORT.md) | Test results |
| [AUDIT_REPORT.md](AUDIT_REPORT.md) | Integration audit |

---

## Requirements

- **Python** 3.9+
- **Node.js** 18+
- **RAM** 8 GB minimum (16 GB recommended)
- **GPU** optional (`GLAUCOMA_DEVICE=cuda`)

---

## Disclaimer

This system is for **educational and screening purposes only**. It is not a substitute for professional medical diagnosis. All findings must be reviewed by a qualified ophthalmologist.

**Mangalore Institute of Technology & Engineering — ISE Dept — Academic Project 2025–26**
