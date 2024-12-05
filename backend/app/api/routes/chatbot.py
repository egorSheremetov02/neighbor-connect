# chatbot.py
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import APIKeyHeader
from openai import OpenAI
from pydantic import BaseModel
from app.api.util import jwt_token_required, hidden_user_payload
# import logging

API_KEY = "sk-proj-XXX-uyKyqkSQoqQA"  
client = OpenAI(api_key=API_KEY)

# Create an API router
chatbot_router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
# logger = logging.getLogger(__name__)

@chatbot_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def chat_endpoint(request: Request, chat_request: ChatRequest, user_payload=Depends(hidden_user_payload)) -> ChatResponse:
    """
    Chat endpoint that handles user messages and returns responses from the chatbot.
    Requires an API token for authorization.

    Parameters
    ----------
    request : Request
        The HTTP request object.
    chat_request : ChatRequest
        The user message for the chatbot.
    token : str
        The Bearer token for authentication.
    
    Returns
    -------
    ChatResponse
        The response from the chatbot.
    """
    # print("chatbot: hiii")
    # print(chat_request)
    # Define OpenAI API key
    
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": chat_request.message}],
            model="gpt-4o",
        )
        # response_message = chat_completion
        response_message = chat_completion.choices[0].message.content
        return ChatResponse(response_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")