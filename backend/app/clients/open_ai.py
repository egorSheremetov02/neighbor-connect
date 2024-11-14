import os
from openai import OpenAI

__open_ai_key = os.environ.get("OPENAI_API_KEY")
open_ai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY")) if __open_ai_key else None