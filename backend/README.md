## Application
Language and frameworks in backend: python, fastApi + pydantic + sqlAlchemy

## Running app

Running application:
``` shell
poetry install

docker run -d -p 5432:5432 --name postgres -e POSTGRES_HOST_AUTH_METHOD=trust postgres

poetry run uvicorn app.main:app --port 8080

```

Testing (swagger):
``` shell
http://localhost:8080/docs
```

Project structure:

```
.
├── API.md
├── API_Chats.md
├── README.md
├── app
│   ├── __init__.py
│   ├── api
│   │   ├── __init__.py
│   │   ├── constants.py
│   │   ├── main.py
│   │   ├── routes              # backend routes aka API
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── chats.py
│   │   │   ├── incidents.py
│   │   │   └── offer.py
│   │   └── util.py
│   ├── api_models             # Descriptions of responses & requests messages
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── chats.py
│   │   ├── incidents.py
│   │   └── offer.py
│   ├── core                    # Configuration of database connection + constants
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── db.py
│   ├── db_models               # Description of all models are stored in database
│   │   ├── __init__.py
│   │   ├── chats.py
│   │   ├── incidents.py
│   │   └── offer.py
│   ├── init_db.py
│   └── main.py                # database initialization 
├── poetry.lock
└── pyproject.toml
```