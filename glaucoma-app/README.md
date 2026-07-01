# Glaucoma Detection — Frontend

React UI for the canonical FastAPI backend in `../glaucoma_project/src/api.py`.

---

## Quick Start

### One command (recommended)

From the **`GLAUCOMA`** repo root:

```powershell
.\start.ps1
```

Or double-click **`start.bat`**.

Starts API (:8000) + frontend (:5173) and opens the browser.

### Manual

```powershell
# Terminal 1 — API
cd glaucoma_project
run_api.bat

# Terminal 2 — Frontend
cd glaucoma-app
npm run dev
```

Open **http://localhost:5173**

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, features, how it works |
| `/upload` | Upload | Drag & drop fundus image, patient form |
| `/results` | Results | Diagnosis, CDR, risk, image tabs, PDF download |

---

## API Integration

| Setting | Value |
|---------|-------|
| Backend | `glaucoma_project/src/api.py` |
| Port | 8000 |
| Upload field | `file` |
| Dev proxy | Vite → `localhost:8000` (`vite.config.js`) |
| Client | `src/api/client.js` |

### Response fields used

- `prediction`, `confidence_score`, `cup_disc_ratio`, `risk_level`
- `optic_disc_image`, `optic_cup_image`, `segmentation_image`, `heatmap_image`
- `recommendations`, `pdf_url`

---

## First-time setup

```powershell
cd glaucoma-app
npm install
```

Requires the API running with model weights at:
`../glaucoma_project/outputs/models/best_model.pth`

---

## Production build

```bash
npm run build    # → dist/
```

Serve with nginx (`nginx.conf` proxies `/predict`, `/health`, `/reports` to FastAPI).

---

## Project layout

```
glaucoma-app/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Upload.jsx
│   │   └── Results.jsx
│   ├── api/client.js
│   ├── components/Layout.jsx
│   └── App.jsx
├── vite.config.js      # Proxy → :8000
├── nginx.conf          # Production reverse proxy
└── package.json
```

---

## Recent changes (June 2026)

- Migrated from Flask (:5000) to **FastAPI (:8000)**
- Multi-page UI: Landing, Upload, Results
- Tailwind CSS + Framer Motion
- Server-side PDF via FastAPI `pdf_url`
- Recharts metrics dashboard on results page
- One-start launcher: `../start.ps1`

**Deprecated:** `flask-api/` folder — see `flask-api/DEPRECATED.md`

---

## Documentation

- **[../MASTER_GUIDE.md](../MASTER_GUIDE.md)** — ★ Everything in one place (full project map)
- [../README.md](../README.md) — Main project README
- [../glaucoma_project/API_INSTRUCTIONS.md](../glaucoma_project/API_INSTRUCTIONS.md) — API reference
- [../ARCHITECTURE.md](../ARCHITECTURE.md) — System architecture
