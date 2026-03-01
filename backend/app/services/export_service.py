from io import BytesIO

import pandas as pd
from fastapi.responses import StreamingResponse
from sqlalchemy import extract
from sqlalchemy.orm import Query

from app.models import Customer
from app.schemas.customer import CustomerFilter


def apply_customer_filters(query: Query, store_id: int, filters: CustomerFilter):
    query = query.filter(Customer.store_id == store_id)
    if filters.age_min is not None:
        query = query.filter(Customer.age >= filters.age_min)
    if filters.age_max is not None:
        query = query.filter(Customer.age <= filters.age_max)
    if filters.birthday_month:
        query = query.filter(extract("month", Customer.date_of_birth) == filters.birthday_month)
    if filters.visit_count_min is not None:
        query = query.filter(Customer.visit_count >= filters.visit_count_min)
    if filters.last_visit_from is not None:
        query = query.filter(Customer.modified_datetime >= filters.last_visit_from)
    return query


def export_customers(customers: list[Customer], export_type: str):
    data = [
        {
            "Name": c.name,
            "Mobile": c.mobile_number,
            "Age": c.age,
            "DateOfBirth": c.date_of_birth,
            "Visits": c.visit_count,
            "LastVisit": c.modified_datetime,
        }
        for c in customers
    ]
    df = pd.DataFrame(data)

    buffer = BytesIO()
    if export_type == "csv":
        buffer.write(df.to_csv(index=False).encode("utf-8"))
        media_type = "text/csv"
        filename = "customers.csv"
    else:
        with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
            df.to_excel(writer, index=False)
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        filename = "customers.xlsx"

    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
