from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.post("/chats")
def create_chat():
    return


@app.put("/chats")
def edit_chat_data():
    return


@app.delete("/chats")
def delete_chat():
    return


@app.post("/chats/{chat_id}")
def send_message(chat_id: int):
    return


@app.get("/chats/{chat_id}")
def list_messages(chat_id: int):
    return