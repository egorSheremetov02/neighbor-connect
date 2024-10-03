# Neighbor Connect App

Neighbor Connect is a web application designed to facilitate communication and interaction among neighbors within a community. It provides features for reporting incidents, sharing offers, initiating chats, and managing user profiles.

## Technologies Used

- **Frontend**:
  - React
  - Vite

  ### Frontend Dependencies:

  - "@emotion/react": "^11.11.4"
  - "@emotion/styled": "^11.11.0"
  - "@mui/icons-material": "^5.15.14"
  - "@mui/material": "^5.15.14"
  - "react": "^18.2.0"
  - "react-dom": "^18.2.0"
  - "react-responsive-modal": "^6.4.2"
  - "react-router-dom": "^6.23.0"

- **Backend**:
  - Python
  - Fastapi

  ### Backend Dependencies:

  - python = "^3.12"
  - fastapi = "^0.110.2"
  - uvicorn = {extras = ["standard"], version = "^0.29.0"}
  - pydantic = "^2.7.1"
  - SQLAlchemy = "^2.0.29"
  - pydantic-settings = "^2.2.1"
  - psycopg2-binary = "^2.9.9"
  - pyjwt = "^2.8.0"
  - bcrypt = "^4.1.2"

## Running the Backend Server [backend folder]

1. Install dependencies:
   ```bash
   poetry install
   ```

2. Run PostgreSQL Docker container:
   ```bash
   docker run -d -p 5432:5432 --name postgres -e POSTGRES_HOST_AUTH_METHOD=trust postgres
   ```

3. Run the backend server:
   ```bash
   poetry run uvicorn app.main:app --port 8080
   ```

4. Test the backend server at: [http://localhost:8080/docs](http://localhost:8080/docs)

## Running the Frontend Server [frontend folder]

1. Install frontend dependencies:
   ```bash
   yarn install
   ```

2. Run the frontend development server:
   ```bash
   yarn run dev
   ```

3. Test the frontend server at: [http://localhost:5173/](http://localhost:5173/)
