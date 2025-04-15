from flask import Blueprint, request, jsonify
from utils.openai_client import get_ai_tags, transcribe_audio
from utils.storage import upload_file
from datetime import datetime
import uuid

entry_bp = Blueprint("entry", __name__)
memory_entries = []

@entry_bp.route("", methods=["POST"])
def create_entry():
    data = request.form
    content = data.get("content", "")
    author_id = data.get("author_id")
    privacy = data.get("privacy", "private")
    journal_id = data.get("journal_id", "default")
    date_of_memory = data.get("date_of_memory") or datetime.utcnow().isoformat()
    source_type = data.get("source_type", "app")
    tags = data.getlist("tags") if "tags" in data else []

    media_urls = []
    transcription = None

    if "media" in request.files:
        for file in request.files.getlist("media"):
            if file.content_length and file.content_length > 15 * 1024 * 1024:
                return jsonify({"error": "File too large to save. Please upload something smaller (under 15MB)."}), 400
            url = upload_file(file, author_id)
            media_urls.append(url)

    # Transcribe audio if applicable
    if source_type == "voice" and "audio" in request.files:
        transcription = transcribe_audio(request.files["audio"])

    if not tags:
        tags += get_ai_tags(content or transcription or "")

    entry = {
        "entry_id": str(uuid.uuid4()),
        "content": content,
        "media_url": media_urls,
        "transcription": transcription,
        "tags": tags,
        "date_of_memory": date_of_memory,
        "timestamp_created": datetime.utcnow().isoformat(),
        "author_id": author_id,
        "privacy": privacy,
        "source_type": source_type,
        "deleted_flag": False,
        "journal_id": journal_id
    }

    memory_entries.append(entry)
    return jsonify(entry), 201
