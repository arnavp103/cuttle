import pytest
from fastapi.testclient import TestClient
from backend.api import app
from datetime import datetime

# Initialize TestClient
client = TestClient(app)

# Expected seed data for comparison
# Based on backend/seed_db.py and frontend/src/pages/Games.tsx
SEED_GAMES_DATA = {
    "V1StGXR8_Z5jdHi6B-myT": {"name": "Rudolph's Game", "current_players": 1, "max_players": 2},
    "LJWvEMDsXYp2Hw7rYA-am": {"name": "Anna's Game", "current_players": 2, "max_players": 2},
    "7oet_d9xzq3BeloxAqoez": {"name": "Haus's Game", "current_players": 0, "max_players": 2}, # Default current_players is 0
}

def is_valid_datetime_string(dt_str):
    """Helper to check if a string is a valid ISO 8601 datetime."""
    try:
        datetime.fromisoformat(dt_str.replace('Z', '+00:00')) # Handle Z for UTC
        return True
    except (ValueError, TypeError):
        return False

class TestGameAPI:
    def test_health_check(self):
        """ Test the health check endpoint. Preserved from existing tests."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}

    def test_get_all_games_success(self):
        """Test retrieving all games, expecting seeded data."""
        response = client.get("/games")
        assert response.status_code == 200
        games_list = response.json()
        assert isinstance(games_list, list)
        
        # Check if all seeded games are present and their data matches
        # This assumes the DB is seeded before tests run.
        # We convert the list to a dict for easier lookup by ID.
        games_from_api = {game['id']: game for game in games_list}

        assert len(games_from_api) >= len(SEED_GAMES_DATA), \
            f"Expected at least {len(SEED_GAMES_DATA)} games, got {len(games_from_api)}"

        for game_id, expected_data in SEED_GAMES_DATA.items():
            assert game_id in games_from_api, f"Game with ID '{game_id}' not found in API response."
            game = games_from_api[game_id]
            assert game['name'] == expected_data['name']
            assert game['current_players'] == expected_data['current_players']
            assert game['max_players'] == expected_data['max_players'] # From schema default
            assert 'created_at' in game and is_valid_datetime_string(game['created_at'])
            assert 'updated_at' in game and is_valid_datetime_string(game['updated_at'])

    def test_get_one_game_success(self):
        """Test retrieving a single game by its ID (Rudolph's Game)."""
        game_id = "V1StGXR8_Z5jdHi6B-myT"
        expected_game_data = SEED_GAMES_DATA[game_id]

        response = client.get(f"/games/{game_id}")
        assert response.status_code == 200
        game = response.json()
        assert isinstance(game, dict)

        assert game['id'] == game_id
        assert game['name'] == expected_game_data['name']
        assert game['current_players'] == expected_game_data['current_players']
        assert game['max_players'] == expected_game_data['max_players'] # Default from schema
        assert 'created_at' in game and is_valid_datetime_string(game['created_at'])
        assert 'updated_at' in game and is_valid_datetime_string(game['updated_at'])

    def test_get_one_game_not_found(self):
        """Test retrieving a non-existent game."""
        non_existent_id = "non_existent_id_123"
        response = client.get(f"/games/{non_existent_id}")
        assert response.status_code == 404
        error_detail = response.json()
        assert error_detail['detail'] == "Game not found"

# To run these tests with pytest, ensure pytest and httpx are installed.
# Also, ensure the FastAPI application's dependencies (like psycopg2) are available.
# The database must be running and seeded for these integration tests to pass.
