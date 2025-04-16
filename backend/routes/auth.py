from flask import Blueprint, request, jsonify
from twilio.rest import Client
from datetime import datetime, timedelta
import os, random
from utils.jwt_auth import generate_jwt

auth_bp = Blueprint("auth", __name__)
# Store login tokens with expiry
login_tokens = {}  # { phone: { token: "123456", expires_at: datetime } }

@auth_bp.route("/request-login", methods=["POST"])
def request_login():
    phone = request.json.get("phone")
    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    token = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    login_tokens[phone] = {"token": token, "expires_at": expires_at}

    # Dev mode: log the token instead of sending SMS
    if os.getenv("FLASK_ENV") == "development":
        print(f"[DEV LOGIN] {phone} → {token}")
    else:
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

    if phone not in login_tokens:
        return jsonify({"error": "No code requested"}), 400

    record = login_tokens[phone]
    if datetime.utcnow() > record["expires_at"]:
        del login_tokens[phone]
        return jsonify({"error": "Code expired"}), 403

    if record["token"] != token:
        return jsonify({"error": "Invalid token"}), 403

    del login_tokens[phone]

    # ✅ Admin role check
    admin_numbers = os.getenv("ADMIN_NUMBERS", "").split(",")
    role = "admin" if phone in admin_numbers else "parent"

    user = {
        "user_id": phone,
        "phone_number": phone,
        "role": role
    }

    jwt_token = generate_jwt(user)
    return jsonify({"token": jwt_token, "user": user}), 200
