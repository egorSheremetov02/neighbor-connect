## Running app

Running application:
``` shell
poetry install

docker run -d -p 5432:5432 --name postgres -e POSTGRES_HOST_AUTH_METHOD=trust postgres

poetry run uvicorn app.main:app --port 8000

```

Testing (swagger):
``` shell
http://localhost:8000/docs
```