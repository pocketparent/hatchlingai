# Hatchling 🐣

A lightweight baby memory journal built with React + Vite + Flask.

## 🧰 Tech Stack

- Frontend: React, TailwindCSS, Vite
- Backend: Flask (Python)
- Auth: Twilio SMS magic link
- AI: OpenAI GPT-4 + Whisper
- Storage: Firebase (media upload)
- Deployment: Render

---

## 🚀 Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py

🌐 Deployment (Render)
This project is deployed to Render:

🔹 Frontend (Static Site)
Root Directory: /frontend

Build Command: npm run build

Publish Directory: dist

Node Version: 18.x

🔹 Backend (Flask API + Gunicorn)
Root Directory: /backend

Build Command: pip install -r requirements.txt

Start Command: gunicorn app:app

Python Version: 3.9+

Add all backend .env variables in Render’s Environment tab

❤️ Made by Tired Parents
Created by @dianamezzanotte with no sleep and a giant iced coffee.
This exists because baby books are beautiful — but hard to write in while holding a 23-lb baby.
