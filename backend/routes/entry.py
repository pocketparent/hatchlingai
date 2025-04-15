from flask import Blueprint, request, jsonify
from utils.openai_client import generate_tags
from utils.storage import upload_file
from datetime import datetime
import uuid

entry_bp = Blueprint("entry", __name__)
memory_entries = []

@entry_bp.route("", methods=["POST"])
def create_entry():
    data = request.form
    content = data.get("content", "")
    date_of_memory = data.get("date_of_memory") or datetime.utcnow().isoformat()
    privacy = data.get("privacy", "private")
    author_id = data.get("author_id")
    journal_id = data.get("journal_id", "default")
    tags = data.getlist("tags") if "tags" in data else []

    media_urls = []
    if "media" in request.files:
        for file in request.files.getlist("media"):
            if file.content_length and file.content_length > 15 * 1024 * 1024:
                return jsonify({"error": "File too large to save. Please upload something smaller (under 15MB)."}), 400
            url = upload_file(file, author_id)
            media_urls.append(url)

    if not tags:
        tags += generate_tags(content)

    entry = {
        "entry_id": str(uuid.uuid4()),
        "content": content,
        "media_url": media_urls,
        "transcription": None,
        "tags": tags,
        "date_of_memory": date_of_memory,
        "timestamp_created": datetime.utcnow().isoformat(),
        "author_id": author_id,
        "privacy": privacy,
        "source_type": "app",
        "deleted_flag": False,
        "journal_id": journal_id
    }

    memory_entries.append(entry)
    return jsonify(entry), 201
