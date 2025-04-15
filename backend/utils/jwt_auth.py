import jwt
import os
from datetime import datetime, timedelta

def generate_jwt(user):
    payload = {
        "user_id": user["user_id"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")
