# To run this FastAPI application independently, use the following command in your terminal:
# uvicorn backend.api:app --reload --port 8000

from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "ok"}
