# DEPRECATED — Flask API Removed

The Flask wrapper in this folder has been **removed** as part of the canonical architecture migration.

## Use the official backend instead

```bash
cd glaucoma_project
python -m uvicorn src.api:app --host 0.0.0.0 --port 8000
```

Or run `run_api.bat` / `run_api.ps1` from `glaucoma_project/`.

## Frontend

The React app (`glaucoma-app/`) now proxies to FastAPI on **port 8000**.

All prediction, segmentation, CDR, ResNet-50, and PDF logic lives in:

- `glaucoma_project/src/prediction_service.py`
- `glaucoma_project/src/pdf_service.py`
- `glaucoma_project/src/api.py`
