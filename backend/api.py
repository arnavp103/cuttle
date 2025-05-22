# To run this FastAPI application independently, use the following command in your terminal:
# uvicorn backend.api:app --reload --port 8000

from fastapi import FastAPI, HTTPException
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

# Assuming your db functions are in backend.db
# If your project structure is different, adjust the import path accordingly.
from backend.db import get_all_games, get_game_by_id

app = FastAPI()

# Pydantic model for Game data
class Game(BaseModel):
    id: str
    name: str
    current_players: int
    max_players: int
    created_at: datetime
    updated_at: datetime

@app.get("/health")
async def health_check():
    """Basic health check endpoint."""
    return {"status": "ok"}

@app.get("/games", response_model=List[Game])
async def list_games():
    """Retrieve all available games."""
    games = get_all_games()
    return games

@app.get("/games/{game_id}", response_model=Game)
async def get_single_game(game_id: str):
    """Retrieve a specific game by its ID."""
    game = get_game_by_id(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game
