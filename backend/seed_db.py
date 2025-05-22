import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Example game data based on frontend/src/pages/Games.tsx
EXAMPLE_GAMES = [
    {"id": "V1StGXR8_Z5jdHi6B-myT", "name": "Rudolph's Game", "current_players": 1},
    {"id": "LJWvEMDsXYp2Hw7rYA-am", "name": "Anna's Game", "current_players": 2},
    {"id": "7oet_d9xzq3BeloxAqoez", "name": "Haus's Game"}, # players will default to 0
]

def seed_database():
    """
    Connects to the PostgreSQL database and seeds the 'games' table with example data.
    """
    conn = None  # Initialize conn to None
    try:
        # Retrieve database connection parameters from environment variables
        db_host = os.getenv("DB_HOST", "localhost")
        db_port = os.getenv("DB_PORT", "5432")
        db_name = os.getenv("DB_NAME")
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")

        if not all([db_name, db_user, db_password]):
            print("Error: Database connection parameters (DB_NAME, DB_USER, DB_PASSWORD) not set.")
            return

        # Connect to the PostgreSQL database
        print(f"Connecting to database '{db_name}' on {db_host}:{db_port} as user '{db_user}'...")
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            dbname=db_name,
            user=db_user,
            password=db_password
        )
        cur = conn.cursor()
        print("Successfully connected to the database.")

        # Insert example games into the 'games' table
        for game in EXAMPLE_GAMES:
            game_id = game["id"]
            name = game["name"]
            # Use provided players count, or let the database default (0) apply if not specified
            current_players = game.get("current_players") # max_players will use default from schema

            try:
                if current_players is not None:
                    print(f"Inserting game: ID={game_id}, Name='{name}', Current Players={current_players}")
                    cur.execute(
                        "INSERT INTO games (id, name, current_players) VALUES (%s, %s, %s) ON CONFLICT (id) DO NOTHING",
                        (game_id, name, current_players)
                    )
                else:
                    print(f"Inserting game: ID={game_id}, Name='{name}' (current_players will default)")
                    cur.execute(
                        "INSERT INTO games (id, name) VALUES (%s, %s) ON CONFLICT (id) DO NOTHING",
                        (game_id, name)
                    )
            except psycopg2.Error as e:
                print(f"Error inserting game {name} (ID: {game_id}): {e}")
                conn.rollback() # Rollback this transaction
            else:
                conn.commit() # Commit this transaction

        print("Database seeding completed successfully.")

    except psycopg2.OperationalError as e:
        print(f"Database connection error: {e}")
    except psycopg2.Error as e:
        print(f"An error occurred during database operations: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    print("Starting database seeding process...")
    seed_database()
