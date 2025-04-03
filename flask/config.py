import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("gemini_api_key")
    TOGETHER_AI_API_KEY = os.getenv("TOGETHER_AI_API_KEY")
    HF_TOKEN = os.getenv("hf_token")
    DATABASE_URL = os.getenv("DATABASE_URL") 