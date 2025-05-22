import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime

# Functions to be tested
from backend.db import get_all_games, get_game_by_id

# Import psycopg2 for mocking its exceptions, not for actual db operations
import psycopg2

# Helper class for mocking cursor.description
class MockColumn:
    def __init__(self, name):
        self.name = name

# Predefined mock description for convenience
MOCK_CURSOR_DESCRIPTION = [
    MockColumn('id'), MockColumn('name'), MockColumn('current_players'),
    MockColumn('max_players'), MockColumn('created_at'), MockColumn('updated_at')
]

class TestDBFunctions(unittest.TestCase):

    @patch('backend.db.get_db_connection')
    def test_get_all_games_success(self, mock_get_db_connection):
        # Configure the mock connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Sample data to be returned by fetchall
        now = datetime.now()
        sample_rows = [
            ("game1", "Game One", 1, 2, now, now),
            ("game2", "Game Two", 0, 4, now, now),
        ]
        mock_cursor.fetchall.return_value = sample_rows
        mock_cursor.description = MOCK_CURSOR_DESCRIPTION

        expected_result = [
            {'id': "game1", 'name': "Game One", 'current_players': 1, 'max_players': 2, 'created_at': now, 'updated_at': now},
            {'id': "game2", 'name': "Game Two", 'current_players': 0, 'max_players': 4, 'created_at': now, 'updated_at': now},
        ]

        result = get_all_games()

        self.assertEqual(result, expected_result)
        mock_get_db_connection.assert_called_once()
        mock_conn.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once_with("SELECT id, name, current_players, max_players, created_at, updated_at FROM games;")
        mock_conn.close.assert_called_once()

    @patch('backend.db.get_db_connection')
    def test_get_all_games_db_error(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Configure execute to raise psycopg2.Error
        mock_cursor.execute.side_effect = psycopg2.Error("Database query failed")

        result = get_all_games()

        self.assertEqual(result, [])
        mock_get_db_connection.assert_called_once()
        mock_conn.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once_with("SELECT id, name, current_players, max_players, created_at, updated_at FROM games;")
        mock_conn.close.assert_called_once()

    @patch('backend.db.get_db_connection')
    def test_get_game_by_id_success(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        now = datetime.now()
        sample_row = ("game1", "Game One", 1, 2, now, now)
        mock_cursor.fetchone.return_value = sample_row
        mock_cursor.description = MOCK_CURSOR_DESCRIPTION

        expected_result = {'id': "game1", 'name': "Game One", 'current_players': 1, 'max_players': 2, 'created_at': now, 'updated_at': now}
        test_game_id = "game1"

        result = get_game_by_id(test_game_id)

        self.assertEqual(result, expected_result)
        mock_get_db_connection.assert_called_once()
        mock_conn.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once_with("SELECT id, name, current_players, max_players, created_at, updated_at FROM games WHERE id = %s;", (test_game_id,))
        mock_conn.close.assert_called_once()

    @patch('backend.db.get_db_connection')
    def test_get_game_by_id_not_found(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        mock_cursor.fetchone.return_value = None # Simulate game not found
        mock_cursor.description = MOCK_CURSOR_DESCRIPTION # Still need description for the initial part of the function

        test_game_id = "non_existent_id"
        result = get_game_by_id(test_game_id)

        self.assertIsNone(result)
        mock_get_db_connection.assert_called_once()
        mock_conn.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once_with("SELECT id, name, current_players, max_players, created_at, updated_at FROM games WHERE id = %s;", (test_game_id,))
        mock_conn.close.assert_called_once()

    @patch('backend.db.get_db_connection')
    def test_get_game_by_id_db_error(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        mock_cursor.execute.side_effect = psycopg2.Error("Database query failed")
        test_game_id = "some_id"

        result = get_game_by_id(test_game_id)

        self.assertIsNone(result)
        mock_get_db_connection.assert_called_once()
        mock_conn.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once_with("SELECT id, name, current_players, max_players, created_at, updated_at FROM games WHERE id = %s;", (test_game_id,))
        mock_conn.close.assert_called_once()

if __name__ == '__main__':
    unittest.main()
