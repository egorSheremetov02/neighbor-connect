# Neighbor Connect App

## About Neighborhood Connect

"Neighbor Connect" is a virtual community center for your neighborhood. It helps you meet and connect with your neighbors, find local services and businesses, make purchases, and stay informed about what's happening nearby. Whether you're looking for a babysitter, want to join a gardening group, or need emergency services, Neighbor Connect is the go-to platform for connecting and building a safer, more engaged community.

## How it works

Neighbors join the platform by creating a profile and connecting with others in their area. They can post requests for help, offer assistance, share resources, or organize local events. The platform provides tools for communication, updates, and alerts, ensuring everyone stays informed and engaged. Neighbor Connect is designed to enhance community bonds through everyday interactions and mutual support.

## Why use it

Neighborhood Connect strengthens community bonds by making it easy to share resources, get help, and stay informed. It promotes safety, collaboration, and local engagement, creating a more supportive environment. Whether it’s organizing events or helping a neighbor, the app fosters a sense of belonging and cooperation, enhancing everyday neighborhood life.

## Features

### 1. Login and Registration

![Login and Registration](./assets/intro-images/signup.png)
![Login and Registration](./assets/intro-images/signin.png)

- Secure login and registration functionality for managing user access.

### 2. Chat Functionality

![Chat Functionality](./assets/intro-images/chats.png)

- Real-time messaging system for neighbors to communicate.

### 3. Incident Reporting

![Incident Reporting](./assets/intro-images/addincident.png)

- Easy-to-use form for reporting incidents within the community.

### 4. Sales Offer

![Sales Offer](./assets/intro-images/home.png)

- A platform for neighbors to list and browse items for sale or trade.

### 5. Sales Offer

![Neighbors](./assets/intro-images/neigbors.png)

- A platform for neighbors to communicate.

### 6. Profile

![Profile](./assets/intro-images/myprofile.png)

- Your profile to Edit.

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

### Option 1: [Locally, manually]

0. Dive into backend folder

   ```
   cd backend
   ```

1. Install dependencies:

   ```bash
   poetry install
   ```

2. Run PostgreSQL Docker container:

   ```bash
   docker run -d -p 5433:5432 --name postgres -e POSTGRES_HOST_AUTH_METHOD=trust postgres
   ```

3. Run the backend server:

   ```bash
   poetry run uvicorn app.main:app --port 8080
   ```

4. Test the backend server at: [http://localhost:8080/docs](http://localhost:8080/docs)

### Option 2: [Locally or remote, automatic]

0. Install docker (docker compose) locally if not already installed

1. Move to root directory of your project

2. Use the bash command below to build a backend container and postgres container, as well as run it
   ```bash
   docker-compose up --build
   ```

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

## Tools for the Project with their official websites

Here’s a list of the tools and technologies used to develop Neighbor Connect, including links to their official websites and useful tutorials.

### Frontend

1. **React** - A JavaScript library for building user interfaces.

   - Official site: [React](https://reactjs.org/)
   - Tutorial: [React Official Tutorial](https://reactjs.org/tutorial/tutorial.html)

2. **Vite** - A build tool for faster development.
   - Official site: [Vite](https://vitejs.dev/)
   - Guide: [Getting Started with Vite](https://vitejs.dev/guide/)

### Frontend Dependencies

- **@emotion/react** - A library for writing CSS styles with JavaScript.

  - Official site: [Emotion](https://emotion.sh/docs/introduction)

- **@mui/icons-material** - Material UI icons for React.

  - Official site: [MUI Icons](https://mui.com/components/icons/)

- **react-responsive-modal** - A simple, responsive modal library for React.

  - Official site: [react-responsive-modal](https://react-responsive-modal.leopradel.com/)

- **react-router-dom** - A routing library for React applications.
  - Official site: [React Router](https://reactrouter.com/en/main)

### Backend

1. **Python** - A powerful, versatile programming language.

   - Official site: [Python](https://www.python.org/)
   - Tutorial: [Python Official Tutorial](https://docs.python.org/3/tutorial/index.html)

2. **FastAPI** - A high-performance Python web framework for building APIs.
   - Official site: [FastAPI](https://fastapi.tiangolo.com/)
   - Tutorial: [FastAPI Full Tutorial](https://fastapi.tiangolo.com/tutorial/)

### Backend Dependencies

- **Uvicorn** - An ASGI web server for Python.

  - Official site: [Uvicorn](https://www.uvicorn.org/)
  - Guide: [Uvicorn Introduction](https://www.uvicorn.org/#quickstart)

- **SQLAlchemy** - A SQL toolkit and ORM for Python.

  - Official site: [SQLAlchemy](https://www.sqlalchemy.org/)
  - Tutorial: [SQLAlchemy Tutorial](https://docs.sqlalchemy.org/en/14/tutorial/)

- **Pydantic** - Data validation and settings management using Python type annotations.

  - Official site: [Pydantic](https://pydantic-docs.helpmanual.io/)
  - Guide: [Pydantic User Guide](https://pydantic-docs.helpmanual.io/usage/)

- **Poetry** - A dependency management tool for Python.

  - Official site: [Poetry](https://python-poetry.org/)
  - Tutorial: [Getting Started with Poetry](https://python-poetry.org/docs/)

- **PostgreSQL** - A powerful, open-source relational database system.
  - Official site: [PostgreSQL](https://www.postgresql.org/)
  - Tutorial: [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

### Other Tools

1. **Docker** - A platform for developing, shipping, and running applications in containers.
   - Official site: [Docker](https://www.docker.com/)
   - Guide: [Docker Getting Started](https://docs.docker.com/get-started/)

### Documentations

- Requirement Documentation: https://docs.google.com/document/d/17m9Jp-vsVd-kxuXfa2swfchQc2MezCDiDNIYg4LUKDc/edit?usp=sharing
- Architecture Documentation: https://docs.google.com/document/d/19VOkKtT8052kxtNJWQu7MV0q74wyAkBZtGdiUQUfWQw/edit?usp=sharing
