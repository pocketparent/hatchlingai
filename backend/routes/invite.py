from flask import Blueprint, request, jsonify

invite_bp = Blueprint("invite", __name__)

@invite_bp.route("/send", methods=["POST"])
def send_invite():
    data = request.json
    inviter_id = data.get("inviter_id")
    phone = data.get("phone")
    role = data.get("role")

    if not all([inviter_id, phone, role]):
        return jsonify({"error": "Missing required fields"}), 400

    # TODO: Send SMS with magic link
    return jsonify({"status": "invite sent"}), 200
