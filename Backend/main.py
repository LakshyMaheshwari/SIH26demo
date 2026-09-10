# Backend/main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import os
import uuid

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ CORRECT PATH for YOUR structure
images_path = "../Frontend/retinascan-app/public/images"

if os.path.exists(images_path):
    app.mount("/images", StaticFiles(directory=images_path), name="images")
    print(f"✅ Images folder found at: {images_path}")
else:
    print(f"⚠️ WARNING: Images folder not found at: {images_path}")
    print("   Please create it with:")
    print("   mkdir -p ../Frontend/retinascan-app/public/images")

# Severity mapping (Levels 0-4)
SEVERITY_MAP = {
    "demo_0": 0,
    "demo_1": 1,
    "demo_2": 2,
    "demo_3": 3,
    "demo_4": 4,
}

@app.post("/upload")
async def upload_image(file: UploadFile):
    temp_path = f"temp_{uuid.uuid4()}.jpg"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    os.remove(temp_path)

    base_name = file.filename.split(".")[0]
    severity = SEVERITY_MAP.get(base_name, 0)

    return {
        "severity": severity,
        "heatmap_url": f"/images/heatmap_{severity}_od.jpg",
        "confidence": 96.4,
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)