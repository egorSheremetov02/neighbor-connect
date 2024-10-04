# Neighbor Connect App

## About Neighbourhood Connect
"Neighbor Connect" is a virtual community center for 
your neighborhood. It helps you meet and connect with 
your neighbors, find local services and businesses and 
make purchases, and also, stay informed about what's 
happening nearby. Neighbor Connect connects with you 
with babysitters, want to join a gardening group, or just 
want to chat with your neighbors, provides emergency 
services in cases like fire, burglary, generation of OTP 
for visitors coming into estate for security reasons; it's 
the place to go..

## How it works
Neighbors join the platform by creating a profile and connecting with others in their area. They can post requests for help, offer assistance, share resources, or organize local events. The platform provides tools for communication, updates, and alerts, ensuring everyone stays informed and engaged. It's a simple way to build stronger community connections through everyday interactions and mutual support.

## Why use it
The Neighborhood Connect app strengthens community bonds by making it easy to share resources, get help, and stay informed. It promotes safety, collaboration, and local engagement, creating a more supportive and connected environment. Whether it’s organizing events or helping a neighbor in need, the app fosters a sense of belonging and cooperation, enhancing everyday neighborhood life.

## Features
- Login and Registration:
    ![Login and Registration](./assets/intro-images/Login%20and%20Registration.png)
    [Login Page](https://google.com/)
- Chat Functionality
    ![Chat Functionality](./assets/intro-images/Chats%20Functionality.png)
    [Chat Page](https://google.com/)
- Incident Reporting
    ![Incident Reporting](./assets/intro-images/Incident%20Reporting.png)
    [Incident Page](https://google.com/)
- Sales Offer
    ![Sales Offer](./assets/intro-images/Sales%20Offer.png)
    [Offer Page](https://google.com/)

## Conclusion
In conclusion, the Neighborhood Connect app fosters stronger, safer, and more engaged communities through its suite of practical features. By simplifying login and registration, neighbors can easily connect with verified local residents. The chat functionality promotes communication and collaboration, while incident reporting enhances neighborhood safety by keeping everyone informed of potential threats. Additionally, the sales offer feature supports local commerce, enabling users to buy, sell, and trade within their community. Together, these features create a more supportive, connected, and thriving neighborhood environment.

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
