# Fixing Windows Long Path Issue for Glaucoma Project

## 📍 Current Location
You are in: `C:\Users\svmoo\OneDrive\Documents\GLAUCOMA`

The helper scripts are in: `C:\Users\svmoo\OneDrive\Documents\GLAUCOMA\glaucoma_project\`

## 🚨 The Problem
When running `pip install -r requirements.txt`, you got this error:
```
ERROR: Could not install packages due to an OSError: [Errno 2] No such file or directory: 
'C:\\Users\\svmoo\\OneDrive\\Documents\\GLAUCOMA\\glaucoma_project\\venv\\share\\jupyter\\labextensions\\@jupyter-widgets\\jupyterlab-manager\\static\\vendors-node_modules_d3-color_src_color_js-node_modules_d3-format_src_defaultLocale_js-node_m-09b215.2643c43f22ad111f4f82.js.map'
```

This is a **Windows Long Path limitation** (default max 260 characters).

## ✅ Solution - Step by Step

### Step 1: Navigate to the Correct Folder
```powershell
cd glaucoma_project
```

### Step 2: Enable Windows Long Path Support (Admin Required)
You have two options:

**Option A: Using Helper Script (Easiest)**
1. Right-click `fix_long_paths.bat` → "Run as administrator"
2. Choose option **1** (Enable Long Paths via Registry)
3. **Restart your computer** when prompted

**Option B: Manual Registry Method**
1. Press `Win + R`, type `regedit`, press Enter (run as admin)
2. Navigate to:  
   `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
3. Right-click in right pane → New → DWORD (32-bit) Value
4. Name it exactly: `LongPathsEnabled`
5. Double-click it → Set Value data to: `1` → Click OK
6. **Restart your computer**

### Step 3: Verify Long Paths are Enabled (After Restart)
Open PowerShell and run:
```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name LongPathsEnabled
```
It should show: `LongPathsEnabled : 1`

### Step 4: Clean Reinstall Dependencies
```powershell
# Remove incomplete venv
Remove-Item -Recurse -Force venv

# Create fresh venv
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt

# Start training
python src\train.py
```

### Alternative: Use the Helper Batch File
After enabling Long Paths and restarting:
```powershell
cd glaucoma_project
.\reinstall_deps.bat
```
This automates all the steps above.

## 📝 Important Notes
1. **Administrator rights required** for enabling Long Paths
2. **Restart is mandatory** after changing the setting
3. The batch files you see in the IDE:
   - `fix_long_paths.bat` - Helps enable Long Paths
   - `reinstall_deps.bat` - Automates clean reinstall
4. If you cannot enable Long Paths, move project to `C:\GLAUCOMA\` as workaround

## 🔧 Manual Verification
To manually check if Long Paths are enabled:
1. Open regedit
2. Go to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
3. Look for `LongPathsEnabled` DWORD = 1

## ❓ Still Having Issues?
1. Double-check you restarted after enabling Long Paths
2. Ensure you ran the fix script **as administrator**
3. Try moving to shorter path: `mkdir C:\GLAUCOMA` and copy project there
4. Temporarily disable antivirus during install if it interferes

---
**Once Long Paths are enabled and you've restarted, run:**
```powershell
cd glaucoma_project
.\reinstall_deps.bat
```
This will give you a clean install and start training.