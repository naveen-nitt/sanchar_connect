from datetime import datetime, timedelta

from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.models import Customer


def dashboard_metrics(db: Session, store_id: int):
    now = datetime.utcnow()
    week_start = now - timedelta(days=7)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    total_customers = db.query(func.count(Customer.id)).filter(Customer.store_id == store_id).scalar() or 0
    total_visits = db.query(func.sum(Customer.visit_count)).filter(Customer.store_id == store_id).scalar() or 0
    weekly_visits = db.query(func.count(Customer.id)).filter(Customer.store_id == store_id, Customer.modified_datetime >= week_start).scalar() or 0
    monthly_visits = db.query(func.count(Customer.id)).filter(Customer.store_id == store_id, Customer.modified_datetime >= month_start).scalar() or 0
    birthdays_month = db.query(func.count(Customer.id)).filter(Customer.store_id == store_id, extract("month", Customer.date_of_birth) == now.month).scalar() or 0
    return {
        "total_customers": total_customers,
        "total_visits": int(total_visits),
        "unique_customers": total_customers,
        "weekly_visits": weekly_visits,
        "monthly_visits": monthly_visits,
        "birthdays_this_month": birthdays_month,
    }


def visits_over_time(db: Session, store_id: int, days: int = 30):
    since = datetime.utcnow() - timedelta(days=days)
    rows = (
        db.query(func.date(Customer.modified_datetime).label("day"), func.count(Customer.id).label("visits"))
        .filter(Customer.store_id == store_id, Customer.modified_datetime >= since)
        .group_by(func.date(Customer.modified_datetime))
        .all()
    )
    return [{"date": str(r.day), "visits": r.visits} for r in rows]


def age_distribution(db: Session, store_id: int):
    ranges = [(0, 18), (19, 25), (26, 35), (36, 50), (51, 120)]
    out = []
    for low, high in ranges:
        count = db.query(func.count(Customer.id)).filter(Customer.store_id == store_id, Customer.age >= low, Customer.age <= high).scalar() or 0
        out.append({"range": f"{low}-{high}", "count": count})
    return out


def upcoming_birthdays(db: Session, store_id: int, days: int = 7):
    now = datetime.utcnow().date()
    target_months = {(now + timedelta(days=i)).month for i in range(days + 1)}
    rows = (
        db.query(Customer)
        .filter(Customer.store_id == store_id, extract("month", Customer.date_of_birth).in_(target_months))
        .limit(50)
        .all()
    )
    return [{"name": c.name, "mobile_number": c.mobile_number, "date_of_birth": c.date_of_birth} for c in rows]
