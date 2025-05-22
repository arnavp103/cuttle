import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_db_connection():
    """
    Retrieves database connection parameters from environment variables
    and returns a psycopg2 connection object.
    Includes error handling for connection failures.
    """
    try:
        db_host = os.getenv("DB_HOST", "localhost")
        db_port = os.getenv("DB_PORT", "5432")
        db_name = os.getenv("DB_NAME")
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")

        if not all([db_name, db_user, db_password]):
            print("Error: Database connection parameters (DB_NAME, DB_USER, DB_PASSWORD) not fully set in environment variables.")
            return None

        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            dbname=db_name,
            user=db_user,
            password=db_password
        )
        return conn
    except psycopg2.OperationalError as e:
        print(f"Database connection error: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred while connecting to the database: {e}")
        return None

def get_all_games():
    """
    Retrieves all games from the 'games' table.
    Returns a list of game dictionaries or an empty list if an error occurs or no games are found.
    """
    conn = get_db_connection()
    if not conn:
        return []

    games_list = []
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, current_players, max_players, created_at, updated_at FROM games;")
            rows = cur.fetchall()
            if rows:
                columns = [desc[0] for desc in cur.description]
                for row in rows:
                    games_list.append(dict(zip(columns, row)))
    except psycopg2.Error as e:
        print(f"Error querying all games: {e}")
    finally:
        if conn:
            conn.close()
    return games_list

def get_game_by_id(game_id: str):
    """
    Retrieves a specific game by its ID from the 'games' table.
    Returns a game dictionary or None if no game is found or an error occurs.
    """
    conn = get_db_connection()
    if not conn:
        return None

    game_data = None
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, current_players, max_players, created_at, updated_at FROM games WHERE id = %s;", (game_id,))
            row = cur.fetchone()
            if row:
                columns = [desc[0] for desc in cur.description]
                game_data = dict(zip(columns, row))
    except psycopg2.Error as e:
        print(f"Error querying game by ID '{game_id}': {e}")
    finally:
        if conn:
            conn.close()
    return game_data

if __name__ == '__main__':
    # Example usage (optional, for testing purposes)
    print("Attempting to connect to the database...")
    connection = get_db_connection()
    if connection:
        print("Successfully connected to the database.")
        print("\nFetching all games...")
        all_games = get_all_games()
        if all_games:
            print(f"Found {len(all_games)} games:")
            for game in all_games:
                print(game)
        else:
            print("No games found or an error occurred.")

        print("\nFetching game with ID 'V1StGXR8_Z5jdHi6B-myT'...")
        sample_game_id = "V1StGXR8_Z5jdHi6B-myT" # Example ID from seed data
        game = get_game_by_id(sample_game_id)
        if game:
            print(f"Game found: {game}")
        else:
            print(f"Game with ID '{sample_game_id}' not found or an error occurred.")
        
        connection.close()
        print("\nDatabase connection closed.")
    else:
        print("Failed to connect to the database. Please check configuration and PostgreSQL server status.")
