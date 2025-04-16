import jwt
import os
from datetime import datetime, timedelta

def generate_jwt(user: dict) -> str:
    payload = {
        "user_id": user["user_id"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")
    return token

def decode_jwt(token: str) -> dict:
    return jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
