from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler

from app.database import SessionLocal
from app.models import Session


scheduler = BackgroundScheduler()


def cleanup_expired_sessions():
    db = SessionLocal()
    try:
        db.query(Session).filter(Session.expires_at < datetime.utcnow()).delete()
        db.commit()
    finally:
        db.close()


def start_cleanup_job():
    if not scheduler.running:
        scheduler.add_job(cleanup_expired_sessions, "interval", minutes=5, id="session_cleanup", replace_existing=True)
        scheduler.start()
