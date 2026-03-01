# Sanchar Connect (MVP)

Production-structured multi-tenant **QR-based customer acquisition + WhatsApp marketing** platform.

## Monorepo Structure

```
/backend
  /src
    /config        # env and db connection
    /controllers   # request handlers
    /middleware    # auth, roles, store isolation
    /models        # mongoose schemas
    /routes        # REST endpoints
    /services      # WhatsApp + QR integrations
    /utils         # filters, exports, token, store id
/frontend
  /src
    /app           # Next.js App Router pages
    /components    # reusable dashboard widgets
    /lib           # axios client
```

## Core Features Delivered

- Multi-tenant store isolation via `store_id`
- Admin + Store Owner roles (JWT auth)
- QR landing route (`/customer/:store_id`) and customer registration logic
- Duplicate customer upsert with visit counter increment
- Dashboard metrics + charts (Recharts)
- Customer filters and CSV/XLSX export
- WhatsApp Cloud API integration (bulk + individual)
- Template manager with variable placeholders
- Auto QR generation when store created
- Security middleware: Helmet, CORS, Mongo sanitize, rate limit
- Future-ready model fields for subscription, loyalty, SMS fallback

## Backend REST API

### Public
- `POST /api/auth/login`
- `POST /api/customer/register`
- `GET /api/health`

### Store Owner (JWT + store scope)
- `GET /api/store/:storeId/dashboard`
- `GET /api/store/:storeId/customers`
- `GET /api/store/:storeId/customers/export?format=csv|xlsx`
- `POST /api/store/:storeId/templates`
- `POST /api/store/:storeId/templates/preview`
- `POST /api/store/:storeId/whatsapp/bulk`
- `POST /api/store/:storeId/whatsapp/individual`

### Admin (JWT + admin role)
- `GET /api/admin/stats`
- `POST /api/admin/stores`

## Setup

### 1) Install
```bash
npm install
```

### 2) Configure env
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3) Run
```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Seed Admin User
Create first admin manually in MongoDB `stores` collection with `role: "admin"` and hashed password.
Or register temporary owner and update role to `admin` for bootstrapping.

## Business Enhancements Included

1. **Engagement playbooks**
   - Birthday + inactivity + repeat visit campaigns.
2. **Segmentation fields**
   - Tags + loyalty points + source tracking.
3. **Scalability prep**
   - Service layer for WhatsApp and QR, easy to extend for Razorpay/SMS.
4. **Data export readiness**
   - CSV/XLSX with filtered audience snapshots.

## Production Hardening Next Steps

- Move JWT into HttpOnly secure cookies
- Add refresh token + session revocation
- Implement webhook for WhatsApp delivery/read status
- Add queue (BullMQ/RabbitMQ) for bulk send reliability
- Add audit logs and per-store usage quotas
- Add automated tests (Jest + Supertest + Playwright)
