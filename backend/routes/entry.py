from flask import Blueprint, request, jsonify
from utils.openai_client import get_ai_tags, transcribe_audio
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid

entry_bp = Blueprint("entry", __name__)
entries = {}

MAX_FILE_SIZE_MB = 15

@entry_bp.route("/", methods=["GET"])
def get_entries():
    results = [e for e in entries.values() if not e.get("deleted_flag")]
    return jsonify(results), 200

@entry_bp.route("/", methods=["POST"])
def create_entry():
    form = request.form
    files = request.files.getlist("media")

    entry_id = str(uuid.uuid4())
    content = form.get("content", "").strip()
    tags = request.form.getlist("tags")
    date_of_memory = form.get("date_of_memory", datetime.utcnow().date().isoformat())
    author_id = form.get("author_id", "demo")
    privacy = form.get("privacy", "private")
    journal_id = form.get("journal_id", "default")
    source_type = form.get("source_type", "app")

    media_urls = []
    transcription = ""

    for file in files:
        if file and allowed_file(file.filename):
            if file.content_length and file.content_length > MAX_FILE_SIZE_MB * 1024 * 1024:
                return jsonify({"error": "File too large"}), 400
            filename = secure_filename(file.filename)
            path = f"/tmp/{uuid.uuid4()}_{filename}"
            file.save(path)
            if filename.lower().endswith((".mp3", ".m4a")):
                with open(path, "rb") as f:
                    transcription = transcribe_audio(f)
            media_urls.append(path)

    if not tags or all(t == "" for t in tags):
        tags = get_ai_tags(content)

    entries[entry_id] = {
        "entry_id": entry_id,
        "content": content,
        "tags": tags,
        "media_url": media_urls,
        "transcription": transcription,
        "date_of_memory": date_of_memory,
        "timestamp_created": datetime.utcnow().isoformat(),
        "author_id": author_id,
        "privacy": privacy,
        "source_type": source_type,
        "journal_id": journal_id,
        "deleted_flag": False
    }

    return jsonify(entries[entry_id]), 200

@entry_bp.route("/<entry_id>", methods=["PATCH"])
def update_entry(entry_id):
    if entry_id not in entries:
        return jsonify({"error": "Entry not found"}), 404

    form = request.form
    content = form.get("content", "").strip()
    tags = request.form.getlist("tags")
    date_of_memory = form.get("date_of_memory")
    privacy = form.get("privacy", "private")

    entry = entries[entry_id]
    entry["content"] = content or entry["content"]
    entry["date_of_memory"] = date_of_memory or entry["date_of_memory"]
    entry["privacy"] = privacy or entry["privacy"]
    entry["tags"] = tags if tags else get_ai_tags(content)

    files = request.files.getlist("media")
    if files:
        entry["media_url"] = []
        for file in files:
            if file and allowed_file(file.filename):
                if file.content_length and file.content_length > MAX_FILE_SIZE_MB * 1024 * 1024:
                    return jsonify({"error": "File too large"}), 400
                filename = secure_filename(file.filename)
                path = f"/tmp/{uuid.uuid4()}_{filename}"
                file.save(path)
                entry["media_url"].append(path)

    entries[entry_id] = entry
    return jsonify(entry), 200

@entry_bp.route("/<entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    if entry_id in entries:
        entries[entry_id]["deleted_flag"] = True
        return jsonify({"status": "deleted"}), 200
    return jsonify({"error": "Not found"}), 404

def allowed_file(filename):
    return filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov", ".mp3", ".m4a"))
