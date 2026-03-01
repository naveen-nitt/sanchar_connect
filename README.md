# Sanchar Connect

Production-oriented multi-tenant QR-based customer acquisition and WhatsApp marketing platform.

## Stack
- Frontend: Next.js App Router, Bootstrap, Axios, Recharts
- Backend: FastAPI, SQLAlchemy, Alembic, MySQL
- Auth: DB-backed session cookies (no JWT)

## Key Features
- Multi-tenant stores by `store_uuid`
- Public QR landing + customer registration with rate limiting
- Session auth (30-minute rolling expiry)
- CSRF protection (`csrf_token` cookie + `X-CSRF-Token` header)
- Store dashboard analytics APIs
- CSV / XLSX export using pandas/openpyxl
- WhatsApp Cloud API bulk/individual sends + logs
- Admin panel store creation + QR generation
- Background expired session cleanup job

## Project Structure
```text
backend/app/{models,schemas,routers,services,middleware,auth}
frontend/app/{customer,store,login,admin,components}
```

## Local Setup
Use one command:

```bash
./setup.sh
```

Then start both services:

```bash
./start.sh
```

## Manual Backend Run
```bash
cd backend
source ../.venv/bin/activate
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Security Notes
- No JWT used.
- HTTP-only session cookie (`session_id`) and `SameSite=Lax`.
- CSRF enforced for mutating authenticated routes.
- Public registration route rate-limited.

## Important Endpoints
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /customer/{store_uuid}`
- `POST /api/customer/register`
- `GET /api/dashboard/metrics`
- `GET /api/dashboard/visits-over-time`
- `GET /api/dashboard/age-distribution`
- `GET /api/dashboard/birthday-upcoming`
- `POST /api/export/customers?format=csv|xlsx`
- `POST /api/whatsapp/bulk`
- `POST /api/whatsapp/individual/{customer_id}`
- `POST /api/admin/stores`
