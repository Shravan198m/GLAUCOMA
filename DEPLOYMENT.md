# Production Deployment Manual

This guide describes the steps required to deploy the Glaucoma Detection System in a production environment. 

---

## Deployment Architecture

The application is split into two components:
1. **Frontend (React + Vite)**: Compiles to static HTML, CSS, and JS. Served via a reverse proxy (Nginx or IIS).
2. **Backend (FastAPI)**: Python REST API that orchestrates the AI pipeline and serves model inference on port `8000`.

```
                  ┌──────────────────────┐
                  │   User Browser       │
                  └──────────┬───────────┘
                             │ HTTP / HTTPS (Port 80/443)
                             ▼
                  ┌──────────────────────┐
                  │ Reverse Proxy (Nginx)│
                  │   Serves Frontend    │
                  └────┬────────────┬────┘
                       │            │
       Static Assets   │            │ /predict, /health, /reports
       (HTML/JS/CSS)   ▼            ▼
         [Local Files]     ┌──────────────────────┐
                           │ FastAPI App (Port 8000)
                           │   ResNet-50 + K-Str  │
                           └──────────────────────┘
```

---

## Method 1: Docker Compose Deployment (Recommended)

Docker Compose is the easiest way to deploy the application in production. It packages all OS-level system libraries (like OpenCV and CUDA drivers) and orchestrates Nginx and FastAPI automatically.

### Prerequisites
* Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows) or Docker Engine (Linux).

### Steps to Deploy
1. **Navigate to project root**:
   ```bash
   cd GLAUCOMA
   ```
2. **Verify Model Weights**: Ensure your PyTorch model weights are placed inside `glaucoma_project/outputs/models/best_model.pth`.
3. **Build and Start Container Services**:
   ```bash
   docker compose up -d --build
   ```
   * The `-d` flag runs the containers in detached (background) mode.
   * The `--build` flag forces Docker to rebuild images using the latest local code adjustments.
4. **Access Applications**:
   * **Frontend Application**: `http://localhost:5173`
   * **Backend REST API**: `http://localhost:8000`
   * **Swagger Interactive Docs**: `http://localhost:8000/docs`
5. **Monitoring and Logs**:
   ```bash
   # Check logs of both services
   docker compose logs -f
   
   # Check service status
   docker compose ps
   ```
6. **Stop Services**:
   ```bash
   docker compose down
   ```

---

## Method 2: Manual Production Deployment (Windows / IIS / Nginx)

If you are deploying on a Windows Server VM without Docker, follow these instructions to configure Nginx as a reverse proxy and run the FastAPI server as a background service.

### Step 1: Prepare and Build Frontend Assets
1. Navigate to the frontend directory:
   ```bash
   cd glaucoma-app
   ```
2. Install dependencies and compile static production files:
   ```bash
   npm install
   npm run build
   ```
   * This creates a `dist/` directory inside `glaucoma-app/` containing optimized, static HTML, CSS, and JS assets.

### Step 2: Set Up Backend Python Environment
1. Navigate to the backend directory:
   ```bash
   cd ../glaucoma_project
   ```
2. Set up a virtual environment and install production packages:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   pip install uvicorn gunicorn  # Web servers
   ```

### Step 3: Run FastAPI in the Background
To run FastAPI persistently on Windows, you can use **NSSM (Non-Sucking Service Manager)** to register it as a Windows System Service:
1. Download [NSSM](https://nssm.cc/download).
2. Open Command Prompt as Administrator and run:
   ```cmd
   nssm install GlaucomaAPI
   ```
3. In the GUI popup, configure the following:
   * **Path**: `C:\path\to\GLAUCOMA\glaucoma_project\venv\Scripts\python.exe`
   * **Startup directory**: `C:\path\to\GLAUCOMA\glaucoma_project`
   * **Arguments**: `-m uvicorn src.api:app --host 127.0.0.1 --port 8000 --workers 4`
4. Click **Install service** and start it via the Services manager (`services.msc`).

### Step 4: Configure Nginx as Reverse Proxy
1. Download [Nginx for Windows](https://nginx.org/en/download.html) and extract it.
2. Edit `nginx/conf/nginx.conf` and paste the following configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com; # Or localhost

       # Path to frontend compiled static files
       location / {
           root C:/path/to/GLAUCOMA/glaucoma-app/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       # Reverse proxy API requests to FastAPI
       location /predict {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_read_timeout 120s;
           client_max_body_size 20M;
       }

       location /health {
           proxy_pass http://127.0.0.1:8000;
       }

       location /reports {
           proxy_pass http://127.0.0.1:8000;
       }

       location /docs {
           proxy_pass http://127.0.0.1:8000;
       }
   }
   ```
3. Start Nginx:
   ```cmd
   start nginx
   ```
4. Access the portal directly on **`http://localhost`** (or your server domain name).

---

## Production Security Checklists

1. **Disable Swagger UI in Public Production**:
   * Set the uvicorn start parameters or configure FastAPI to hide docs:
     `app = FastAPI(docs_url=None, redoc_url=None)` if public safety mandates it.
2. **CORS Configuration**:
   * In `glaucoma_project/src/config.py` (or environment variables), set `CORS_ORIGINS` to your exact domain name (e.g., `https://yourdomain.com`) instead of the wildcard `*`.
3. **Enable SSL/TLS**:
   * Always secure client traffic with SSL. Configure HTTPS (Port 443) in Nginx/IIS with Let's Encrypt certificates.
4. **Volume Backups**:
   * Back up patient reports generated under `glaucoma_project/outputs/reports/` regularly.

---
