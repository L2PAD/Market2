"""
Payments Module - RozetkaPay Integration
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import aiohttp
import base64
import uuid
import hashlib
import hmac

from core.db import db
from core.config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])

ROZETKAPAY_API = "https://api.rozetkapay.com/api/payments/v1"


class CreatePaymentRequest(BaseModel):
    order_id: str
    amount: float
    description: str
    callback_url: Optional[str] = None


class PaymentResponse(BaseModel):
    payment_id: str
    checkout_url: str
    status: str


def get_auth_header():
    """Generate RozetkaPay auth header"""
    credentials = f"{settings.ROZETKAPAY_LOGIN}:{settings.ROZETKAPAY_PASSWORD}"
    encoded = base64.b64encode(credentials.encode()).decode()
    return {"Authorization": f"Basic {encoded}"}


@router.post("/create", response_model=PaymentResponse)
async def create_payment(data: CreatePaymentRequest):
    """Create RozetkaPay payment"""
    if not settings.ROZETKAPAY_LOGIN:
        raise HTTPException(status_code=503, detail="Payment service not configured")
    
    payment_id = str(uuid.uuid4())
    
    payload = {
        "amount": int(data.amount * 100),  # Convert to kopecks
        "currency": "UAH",
        "external_id": payment_id,
        "description": data.description,
        "callback_url": data.callback_url or f"{settings.CORS_ORIGINS}/api/payments/callback"
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{ROZETKAPAY_API}/new",
            json=payload,
            headers=get_auth_header()
        ) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=502, detail="Payment service error")
            
            result = await resp.json()
    
    # Save payment record
    await db.payments.insert_one({
        "id": payment_id,
        "order_id": data.order_id,
        "amount": data.amount,
        "status": "pending",
        "provider_id": result.get("id"),
        "created_at": datetime.now(timezone.utc)
    })
    
    return PaymentResponse(
        payment_id=payment_id,
        checkout_url=result.get("action", {}).get("value", ""),
        status="pending"
    )


@router.post("/callback")
async def payment_callback(request: Request):
    """Handle RozetkaPay webhook"""
    body = await request.json()
    
    external_id = body.get("external_id")
    status = body.get("status")
    
    if not external_id:
        return {"status": "error"}
    
    # Update payment status
    await db.payments.update_one(
        {"id": external_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
    )
    
    # If successful, update order
    if status == "success":
        payment = await db.payments.find_one({"id": external_id})
        if payment:
            await db.orders.update_one(
                {"id": payment["order_id"]},
                {"$set": {"payment_status": "paid"}}
            )
    
    return {"status": "ok"}


@router.get("/{payment_id}")
async def get_payment_status(payment_id: str):
    """Get payment status"""
    payment = await db.payments.find_one({"id": payment_id}, {"_id": 0})
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return payment
