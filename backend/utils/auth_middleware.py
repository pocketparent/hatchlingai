from functools import wraps
from flask import request, jsonify
from utils.jwt_auth import decode_jwt

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Authorization token required"}), 401
        try:
            decoded = decode_jwt(token)
            request.user = decoded  # Attach to request
            return f(*args, **kwargs)
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401
    return wrapper

def require_parent_role(f):
    @wraps(f)
    @require_auth
    def wrapper(*args, **kwargs):
        user = request.user
        if user.get("role") != "parent":
            return jsonify({"error": "Permission denied: only parents allowed"}), 403
        return f(*args, **kwargs)
    return wrapper
