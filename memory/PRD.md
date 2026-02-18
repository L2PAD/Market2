# Y-Store Marketplace - Product Requirements Document

## Overview
Y-Store is a production-ready e-commerce marketplace platform built with FastAPI (backend) and React (frontend). The system features a hardened order management system with state machine, optimistic locking, and secure payment processing via Fondy.

## Architecture

### Backend Structure
```
/app/backend/
├── app.py              # Modular entry point (not used - supervisor runs server.py)
├── server.py           # Main monolithic app with V2 routers integrated
├── core/
│   ├── config.py       # Pydantic settings (env vars)
│   ├── db.py           # MongoDB connection
│   └── security.py     # JWT auth, password hashing
├── modules/
│   ├── orders/         # V2 Orders (state machine, locking)
│   │   ├── routes.py
│   │   ├── order_status.py
│   │   ├── order_state_machine.py
│   │   ├── order_repository.py
│   │   └── order_idempotency.py
│   ├── payments/       # V2 Payments (Fondy integration)
│   │   ├── routes.py
│   │   ├── service.py
│   │   ├── payment_events_repository.py
│   │   ├── payment_webhook_service.py
│   │   └── providers/
│   │       ├── base.py           # Abstract PaymentProvider
│   │       └── fondy/
│   │           ├── fondy_provider.py
│   │           └── fondy_signature.py
│   └── ... (other modules)
└── tests/
    └── test_orders_payments_v2.py
```

### API Versioning
- Legacy API: `/api/*` (from server.py)
- V2 Production API: `/api/v2/*` (from modules)

## Implemented Features (BLOCK M1-M2)

### BLOCK M1: Orders Hardening ✅
- **State Machine**: OrderStatus enum with allowed transitions
  - NEW → AWAITING_PAYMENT, PROCESSING, CANCELED
  - AWAITING_PAYMENT → PAID, CANCELED
  - PAID → PROCESSING, REFUNDED
  - PROCESSING → SHIPPED, CANCELED, REFUNDED
  - SHIPPED → DELIVERED
  - DELIVERED → REFUNDED
  - CANCELED, REFUNDED → (terminal states)
- **Atomic Updates**: `find_one_and_update` with query conditions
- **Optimistic Locking**: `version` field increments on each update
- **Status History**: Complete audit trail of all transitions

### BLOCK M1.1: Webhook Safety ✅
- **payment_events Collection**: Idempotent event storage
- **atomic_mark_paid**: Prevents double-payment processing
- **Duplicate Detection**: Returns OK for already-processed events

### BLOCK M1.2: Webhook Security ✅
- **HMAC Verification**: SHA1 signature per Fondy docs
- **Replay Protection**: Signature hash stored for duplicate detection
- **401 Response**: For missing/invalid signatures

### BLOCK M2: Fondy Integration ✅
- **Provider Abstraction**: `PaymentProvider` base class
- **FondyProvider**: Implementation with create_payment, verify_webhook, parse_webhook
- **Checkout Session**: Creates payment URL via Fondy API
- **Webhook Handling**: Secure callback processing

## API Endpoints

### V2 Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v2/orders | Create order (supports X-Idempotency-Key) |
| GET | /api/v2/orders/my | Get user's orders |
| GET | /api/v2/orders/{id} | Get single order |
| GET | /api/v2/orders/{id}/transitions | Get allowed transitions |
| POST | /api/v2/orders/{id}/cancel | Cancel order |
| PUT | /api/v2/orders/{id}/status | Admin: Update status |
| GET | /api/v2/orders | Admin: Get all orders |

### V2 Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v2/payments/checkout | Create Fondy checkout |
| POST | /api/v2/payments/webhook/fondy | Fondy webhook callback |
| GET | /api/v2/payments/status/{order_id} | Get payment status |

## Environment Variables

### Required for Fondy
```
FONDY_MERCHANT_ID=<your_merchant_id>
FONDY_MERCHANT_PASSWORD=<your_password>
FONDY_CALLBACK_URL=https://your-domain.com/api/v2/payments/webhook/fondy
FONDY_RETURN_URL=https://your-domain.com/payment/success
```

## Test Credentials
- Email: test@example.com
- Password: test123
- Role: admin

## Testing
- All 24 backend tests passing (100%)
- Test file: `/app/backend/tests/test_orders_payments_v2.py`

---

## Upcoming Tasks

### BLOCK M3: Nova Poshta TTN Automation (P0)
- Idempotent TTN creation process
- Auto-transition: PROCESSING → SHIPPED
- Duplicate prevention

### Future Tasks
- Add WayForPay as fallback payment provider
- Frontend integration with V2 APIs
- Admin panel updates for order management

---

Last Updated: 2026-02-18
