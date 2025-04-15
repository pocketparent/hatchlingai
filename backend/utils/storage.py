from firebase_admin import storage
import uuid

def upload_file(file, user_id):
    blob = storage.bucket().blob(f"{user_id}/{uuid.uuid4()}_{file.filename}")
    blob.upload_from_file(file, content_type=file.content_type)
    blob.make_public()
    return blob.public_url
