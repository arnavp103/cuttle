# Backend Setup

This document provides instructions for setting up the backend service, including database configuration.

## Prerequisites

- Python 3.10 or higher
- Poetry for dependency management
- PostgreSQL

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   poetry install
   ```

## PostgreSQL Database Setup

The application requires a PostgreSQL database to store data. Follow these steps to set it up locally:

### 1. Install PostgreSQL

Choose the installation method appropriate for your operating system:

- **Debian/Ubuntu (using APT):**
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  ```
  After installation, the PostgreSQL service should start automatically. You can check its status with:
  ```bash
  sudo systemctl status postgresql
  ```

- **macOS (using Homebrew):**
  ```bash
  brew install postgresql
  ```
  To have launchd start postgresql now and restart at login:
  ```bash
  brew services start postgresql
  ```
  Or, if you don't want/need a background service you can just run:
  ```bash
  pg_ctl -D /usr/local/var/postgres start
  ```

- **Windows (using official installer):**
  Download and run the official PostgreSQL installer from the [PostgreSQL website](https://www.postgresql.org/download/windows/). Follow the instructions provided by the installer. Make sure to install pgAdmin as well, which is a useful GUI tool for managing PostgreSQL.

### 2. Create Database and User

Once PostgreSQL is installed, you need to create a database and a user for the application.

1. **Open the PostgreSQL command-line interface (psql):**
   - On Linux/macOS, you might need to switch to the `postgres` user first:
     ```bash
     sudo -i -u postgres
     psql
     ```
   - On Windows, if you installed pgAdmin, you can use its SQL query tool, or find `psql` in your Start Menu.

2. **Create a new user:**
   Replace `your_user` and `your_password` with your desired credentials.
   ```sql
   CREATE USER your_user WITH PASSWORD 'your_password';
   ```

3. **Create a new database:**
   Replace `your_db_name` with your desired database name. It's common to use the application's name.
   ```sql
   CREATE DATABASE your_db_name;
   ```

4. **Grant privileges to the user on the database:**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_user;
   ```

5. **(Optional) Set client encoding to UTF8 (recommended):**
   While connected to your new database (`\c your_db_name`), run:
   ```sql
   ALTER DATABASE your_db_name SET client_encoding TO 'utf8';
   ```

6. **Exit psql:**
   ```sql
   \q
   ```
   If you switched to the `postgres` user, type `exit` to return to your normal user.

### 3. Configure Environment Variables

The application uses environment variables to connect to the database. Create a `.env` file in the `backend` directory or set these variables in your environment:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_user
DB_PASSWORD=your_password
```

- `DB_HOST`: The host where your PostgreSQL server is running (usually `localhost`).
- `DB_PORT`: The port PostgreSQL is listening on (default is `5432`).
- `DB_NAME`: The name of the database you created (e.g., `your_db_name`).
- `DB_USER`: The user you created (e.g., `your_user`).
- `DB_PASSWORD`: The password for the user (e.g., `your_password`).

## Running the Application

Once the database is set up and environment variables are configured, you can run the application:

```bash
poetry run uvicorn main:app --reload
```

(Assuming your FastAPI application is in `main.py` and named `app`)

Replace `<repository-url>` and update FastAPI app details if needed.

## Database Schema

The primary table in the database is `games`, which stores information about individual game sessions, including their unique ID, name, current number of players, maximum player capacity, and timestamps for creation and updates.

For the detailed Data Definition Language (DDL) including table structure, constraints, and triggers, please refer to the `backend/schema.sql` file.

## Setting up the Schema

After creating your database and user as described in the "PostgreSQL Database Setup" section, you need to apply the schema.

Run the following command from the `backend` directory, replacing `YOUR_USER` and `YOUR_DB_NAME` with the actual username and database name you created:

```bash
psql -U YOUR_USER -d YOUR_DB_NAME -a -f schema.sql
```

You will be prompted for the password of `YOUR_USER`.

## Seeding the Database

To populate the database with initial sample data for development and testing, a seed script is provided. This script uses the example game data found in `frontend/src/pages/Games.tsx`.

Before running the seed script, ensure that the environment variables for the database connection (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) are correctly set in your `.env` file or your environment, as detailed in the "Configure Environment Variables" section.

To run the seed script, execute the following command from the project's root directory (not the `backend` directory):

```bash
python backend/seed_db.py
```

The script will print messages indicating its progress and any potential errors.

## Running Tests

The backend includes both unit tests (for database functions) and integration tests (for API endpoints).

To run all tests, navigate to the project's root directory and execute:

```bash
python -m unittest discover -s backend -p "test_*.py"
```

**Important Considerations for Testing:**

*   **Unit Tests (`backend/test_db.py`)**: These mock the database connection and do not require a running PostgreSQL instance.
*   **Integration Tests (`backend/test_api.py`)**: These tests interact with the actual API endpoints and therefore require:
    1.  A running PostgreSQL server.
    2.  The database to be created and the schema applied (see "Setting up the Schema").
    3.  The database to be seeded with initial data (see "Seeding the Database"), as the tests may verify against this specific data.
    4.  Correct environment variables set for the database connection.

Ensure these conditions are met before running integration tests to avoid failures.
