from flask import Blueprint, request, jsonify

stripe_bp = Blueprint("stripe", __name__)

@stripe_bp.route("/webhook", methods=["POST"])
def handle_webhook():
    event = request.json
    event_type = event.get("type")

    # Log or handle events
    if event_type == "customer.subscription.trial_will_end":
        pass
    elif event_type == "invoice.payment_succeeded":
        pass
    elif event_type == "invoice.payment_failed":
        pass

    return jsonify({"status": "received"}), 200
