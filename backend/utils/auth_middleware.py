import os
import jwt
from flask import request, jsonify

def require_parent_role(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Unauthorized"}), 401
        try:
            decoded = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
            if decoded.get("role") != "parent":
                return jsonify({"error": "Permission denied: Only parents may perform this action."}), 403
            return f(*args, **kwargs)
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401
    wrapper.__name__ = f.__name__
    return wrapper
