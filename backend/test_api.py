import pytest
from httpx import AsyncClient
from backend.api import app # Assuming app is directly importable

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://127.0.0.1:8000") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
