from fastapi import FastAPI
from datetime import datetime

app = FastAPI(
    title="MediConnect AI Services",
    description="AI microservices for the MediConnect AI healthcare platform",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "MediConnect AI AI Service is running",
        "service": "Python + FastAPI",
    }


@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": "ai-services",
        "timestamp": datetime.utcnow().isoformat(),
    }