# Sanchar Connect - Multi-tenant QR + WhatsApp Marketing SaaS

Production-structured MVP for QR-based customer acquisition, store analytics, and WhatsApp campaigns.

## Stack
- Frontend: Next.js App Router + Bootstrap + Axios + Recharts
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT + Role-based access
- Integrations: WhatsApp Business Cloud API + CSV/Excel export

## Key Business Features
- Multi-tenant architecture (store-level isolation)
- QR onboarding (`/customer/{store_id}`)
- Auto-upsert customer registration with visit count tracking
- Store dashboard analytics + charts
- Customer filtering + CSV/XLSX exports
- WhatsApp bulk and individual messaging + template manager
- Admin panel to onboard stores, generate unique IDs, auto-generate downloadable QR images

## Folder Structure

```text
/backend
  /src
    /config        # env + db
    /controllers   # auth, admin, customer, dashboard, exports, messages
    /middleware    # auth RBAC, store isolation, rate limits
    /models        # Store, Customer, MessageTemplate, MessageLog
    /routes        # REST routes
    /services      # WhatsApp, export, QR
    /utils         # store ID and age helpers
    app.js
    server.js
/frontend
  /app
    /admin
    /customer/[storeId]
    /login
    /store/[storeId]
  /components
  /lib
```

## Setup
1. Install dependencies
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Configure env files
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env.local`
3. Start backend
   - `cd backend && npm run dev`
4. Start frontend
   - `cd frontend && npm run dev`

## REST API Endpoints
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/customer/register`
- `GET /api/customer?store_id=...&minAge=...`
- `GET /api/dashboard/:storeId`
- `GET /api/export/customers?store_id=...&format=csv|xlsx`
- `POST /api/messages/templates`
- `GET /api/messages/templates`
- `POST /api/messages/bulk`
- `POST /api/messages/single`
- `POST /api/admin/stores` (admin)
- `GET /api/admin/stats` (admin)

## Security
- Helmet + CORS
- Mongo sanitize
- Rate limiting on customer submissions
- JWT auth + role-based authorization
- Store-level data isolation middleware

## WhatsApp API Notes
Set `whatsapp_access_token` and `whatsapp_phone_number_id` per store during admin creation.
The app calls Meta Graph API endpoint:
`https://graph.facebook.com/{version}/{phone_number_id}/messages`

## Future-ready extension points
- Billing metadata is already embedded in `Store.metadata` for Razorpay onboarding
- Customer model includes loyalty and purchase fields for future tracking
- SMS fallback toggle in store metadata
- Structure supports adding one owner -> multiple stores relation by normalizing owner entity

## Suggested Business Enhancements
- Add campaign scheduler + timezone-aware sends
- Add webhook endpoint for delivery/read receipts and campaign ROI dashboard
- Add consent + opt-out ledger for compliance
- Add A/B template testing and smart segments (RFM, recency)
- Add coupon engine and POS sync for conversion attribution
