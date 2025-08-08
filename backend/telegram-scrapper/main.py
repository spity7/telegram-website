# backend/telegram-scraper/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from fastapi.staticfiles import StaticFiles
import os
from os import getenv
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

app = FastAPI()

# Serve downloaded images
app.mount("/media", StaticFiles(directory="downloaded_media"), name="media")

# Allow access from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify "http://localhost:3000" for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
mongo = MongoClient(mongo_uri)
db = mongo.telegram_db

@app.get("/search")
def search_posts(query: str):
    posts = db.posts.find({"text": {"$regex": query, "$options": "i"}})
    return [
        {
            "text": p.get("text"),
            "channel": p.get("channel"),
            "date": p.get("date"),
            "message_id": p.get("message_id"),
            "media_url": f"http://localhost:8000/media/{os.path.basename(p['media_path'])}" if p.get("media_path") else None
        }
        for p in posts
    ]
