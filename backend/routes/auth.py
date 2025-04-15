from flask import Blueprint, request, jsonify
from twilio.rest import Client
import os, random
from utils.jwt_auth import generate_jwt

auth_bp = Blueprint("auth", __name__)
login_tokens = {}

@auth_bp.route("/request-login", methods=["POST"])
def request_login():
    phone = request.json.get("phone")
    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    token = str(random.randint(100000, 999999))
    login_tokens[phone] = token

    try:
        client = Client(os.getenv("TWILIO_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
        client.messages.create(
            body=f"Your Hatchling login code: {token}",
            from_=os.getenv("TWILIO_PHONE_NUMBER"),
            to=phone
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"status": "sent"}), 200

@auth_bp.route("/verify-token", methods=["POST"])
def verify_token():
    data = request.json
    phone = data.get("phone")
    token = data.get("token")

    if login_tokens.get(phone) != token:
        return jsonify({"error": "Invalid token"}), 403

    del login_tokens[phone]

    # Simulate user lookup/creation
    user = {
        "user_id": f"user_{random.randint(1000,9999)}",
        "phone_number": phone,
        "role": "parent"
    }

    jwt_token = generate_jwt(user)
    return jsonify({"token": jwt_token, "user": user}), 200
