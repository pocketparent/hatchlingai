from flask import Blueprint, request, jsonify
from twilio.rest import Client
import os

invite_bp = Blueprint("invite", __name__)

@invite_bp.route("/send", methods=["POST"])
def send_invite():
    data = request.json
    inviter_id = data.get("inviter_id")
    recipient_phone = data.get("phone")
    role = data.get("role")  # 'co-parent' or 'caregiver'

    if not all([inviter_id, recipient_phone, role]):
        return jsonify({"error": "Missing inviter_id, phone, or role"}), 400

    try:
        magic_link = f"{os.getenv('FRONTEND_URL')}/login?invite=true&phone={recipient_phone}&role={role}"

        client = Client(os.getenv("TWILIO_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
        client.messages.create(
            to=recipient_phone,
            from_=os.getenv("TWILIO_PHONE_NUMBER"),
            body=f"👶 You’ve been invited to Hatchling as a {role}. Tap to join: {magic_link}"
        )
        return jsonify({"status": "Invite sent"}), 200

    except Exception as e:
        print(f"Invite SMS failed: {e}")
        return jsonify({"error": "Failed to send invite"}), 500
