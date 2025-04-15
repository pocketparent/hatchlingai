from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Firebase after env vars
from utils import firebase

# ✅ Import blueprints
from routes.entry import entry_bp
from routes.auth import auth_bp
from routes.invite import invite_bp
from routes.stripe_webhook import stripe_bp

# ✅ Create app
app = Flask(__name__)
app.url_map.strict_slashes = False

# ✅ CORS
CORS(app,
     origins=[
         "https://myhatchling.ai",
         "https://www.myhatchling.ai",
         "http://localhost:5173",
         "http://127.0.0.1:5173"
     ],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])

# ✅ Health check
@app.route("/", methods=["GET"])
def index():
    return {"status": "ok", "message": "Hatchling API is live"}, 200

# ✅ Debug route
@app.route("/debug-routes")
def debug_routes():
    return {
        "routes": [str(rule) for rule in app.url_map.iter_rules()]
    }

# ✅ Register routes
app.register_blueprint(entry_bp, url_prefix="/api/entry")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(invite_bp, url_prefix="/api/invite")
app.register_blueprint(stripe_bp, url_prefix="/api/stripe")

if __name__ == "__main__":
    app.run(debug=True)
