from flask import Blueprint, request, jsonify
from twilio.rest import Client
from utils.auth_middleware import require_parent_role
import os

invite_bp = Blueprint("invite", __name__)

@invite_bp.route("/send", methods=["POST"])
@require_parent_role
def send_invite():
    data = request.json
    inviter_id = data.get("inviter_id")
    phone = data.get("phone")
    role = data.get("role")  # caregiver or co-parent

    if not all([inviter_id, phone, role]):
        return jsonify({"error": "Missing inviter_id, phone, or role"}), 400

    try:
        link = f"{os.getenv('FRONTEND_URL')}/login?invite=true&phone={phone}&role={role}"
        client = Client(os.getenv("TWILIO_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
        client.messages.create(
            to=phone,
            from_=os.getenv("TWILIO_PHONE_NUMBER"),
            body=f"👶 You’ve been invited to Hatchling as a {role}. Tap to join: {link}"
        )
        return jsonify({"status": "Invite sent"}), 200

    except Exception as e:
        print("❌ Invite send failed:", e)
        return jsonify({"error": "Could not send invite"}), 500
