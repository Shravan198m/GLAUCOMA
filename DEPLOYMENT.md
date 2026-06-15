# Deployment Guide — Canonical FastAPI Architecture

## Architecture

```
glaucoma-app (React :5173) → glaucoma_project/src/api.py (FastAPI :8000)
                                    ↓
                          prediction_service.py → AI modules
                                    ↓
                          pdf_service.py → outputs/reports/
```

## Local Development

### One command (recommended)

From the repository root:

```powershell
.\start.ps1
```

Or double-click **`start.bat`**.

This starts:
- FastAPI on http://localhost:8000 (new terminal)
- React frontend on http://localhost:5173 (new terminal)
- Opens the browser automatically

### Manual (two terminals)

**API:**
```bash
cd glaucoma_project
pip install -r requirements.txt
python -m uvicorn src.api:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**
```bash
cd glaucoma-app
npm install
npm run dev
```

## Docker

```bash
docker compose up --build
```

- API: http://localhost:8000
- Frontend: http://localhost:5173
- Swagger: http://localhost:8000/docs

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | API port |
| `GLAUCOMA_DEVICE` | `cpu` | PyTorch device |
| `CORS_ORIGINS` | `*` | Allowed origins |
| `VITE_API_URL` | `` | Frontend API base (empty = proxy) |

## Tests

```bash
cd glaucoma_project
python -m pytest tests/test_api_integration.py -v
```
