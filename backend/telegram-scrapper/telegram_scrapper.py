from telethon.sync import TelegramClient
from telethon.tl.types import Message
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import time

# Load environment variables
load_dotenv()

api_id = int(os.getenv("TELEGRAM_API_ID"))
api_hash = os.getenv("TELEGRAM_API_HASH")
mongo_uri = os.getenv("MONGO_URI")

channels = ['blocks_01']  # Replace with your channel(s)
media_folder = "downloaded_media"
os.makedirs(media_folder, exist_ok=True)

# Initialize clients
client = TelegramClient('session', api_id, api_hash)
mongo = MongoClient(mongo_uri)
db = mongo.telegram_db

# Optional: Delay in seconds between processing each message (to avoid Telegram rate limits)
DELAY_BETWEEN_MESSAGES = 0.1  # 100ms

def is_compressed_file(filename):
    return filename.endswith((".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz"))

with client:
    for channel in channels:
        print(f"🔍 Fetching messages from: {channel}")
        total_scraped = 0

        # Get last saved message ID
        last_post = db.posts.find_one(
            {"channel": channel},
            sort=[("message_id", -1)]
        )
        last_message_id = last_post["message_id"] if last_post else 0
        print(f"➡ Last saved message ID: {last_message_id}")

        # Use iterator to fetch messages in batches
        messages = client.iter_messages(channel, min_id=last_message_id, reverse=True)

        for msg in messages:
            if not isinstance(msg, Message): continue

            media_path = None

            # If there is media
            if msg.media:
                skip = False

                # If it's a document with a filename
                if msg.document:
                    for attr in msg.document.attributes:
                        if hasattr(attr, "file_name"):
                            filename = attr.file_name.lower()
                            if is_compressed_file(filename):
                                print(f"⏩ Skipping compressed file: {filename}")
                                skip = True
                                break
                if skip:
                    continue

                file = client.download_media(msg, file=media_folder)
                if file:
                    media_path = file

            # Insert into MongoDB
            db.posts.insert_one({
                'channel': channel,
                'date': msg.date.isoformat() if msg.date else None,
                'text': msg.text,
                'message_id': msg.id,
                'media_path': media_path
            })

            total_scraped += 1
            if total_scraped % 100 == 0:
                print(f"✅ Scraped {total_scraped} messages so far...")

            time.sleep(DELAY_BETWEEN_MESSAGES)

        print(f"🎉 Done. Total messages scraped for {channel}: {total_scraped}")
