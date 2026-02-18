"""
Orders Module - Models & Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
from enum import Enum
import uuid

from core.db import db
from core.security import get_current_user, get_current_admin

router = APIRouter(prefix="/orders", tags=["Orders"])


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float
    name: str


class ShippingAddress(BaseModel):
    full_name: str
    phone: str
    city: str
    address: str
    postal_code: Optional[str] = None
    np_department: Optional[str] = None
    notes: Optional[str] = None


class CreateOrderRequest(BaseModel):
    shipping: ShippingAddress
    payment_method: str = "cash"
    notes: Optional[str] = None


class Order(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    shipping: ShippingAddress
    status: OrderStatus
    payment_method: str
    payment_status: str = "pending"
    subtotal: float
    shipping_cost: float = 0
    total: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class OrderResponse(Order):
    user_name: Optional[str] = None
    user_email: Optional[str] = None


@router.post("", response_model=Order)
async def create_order(
    data: CreateOrderRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create new order from cart"""
    user_id = current_user["id"]
    
    # Get cart
    cart = await db.carts.find_one({"user_id": user_id})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Build order items
    order_items = []
    subtotal = 0
    
    for cart_item in cart["items"]:
        product = await db.products.find_one({"id": cart_item["product_id"]}, {"_id": 0})
        if not product:
            continue
        
        order_items.append(OrderItem(
            product_id=product["id"],
            quantity=cart_item["quantity"],
            price=product["price"],
            name=product["name"]
        ))
        subtotal += product["price"] * cart_item["quantity"]
        
        # Increment sales count
        await db.products.update_one(
            {"id": product["id"]},
            {"$inc": {"sales_count": cart_item["quantity"]}}
        )
    
    if not order_items:
        raise HTTPException(status_code=400, detail="No valid products in cart")
    
    order_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    order_doc = {
        "id": order_id,
        "user_id": user_id,
        "items": [item.model_dump() for item in order_items],
        "shipping": data.shipping.model_dump(),
        "status": OrderStatus.PENDING,
        "payment_method": data.payment_method,
        "payment_status": "pending",
        "subtotal": subtotal,
        "shipping_cost": 0,
        "total": subtotal,
        "notes": data.notes,
        "created_at": now
    }
    
    await db.orders.insert_one(order_doc)
    
    # Clear cart
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": {"items": [], "updated_at": now}}
    )
    
    return Order(**order_doc)


@router.get("/my", response_model=List[Order])
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    """Get current user's orders"""
    orders = await db.orders.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return [Order(**o) for o in orders]


@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get single order"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check ownership or admin
    if current_user["role"] != "admin" and order["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return Order(**order)


@router.get("", response_model=List[OrderResponse])
async def get_all_orders(
    status: Optional[OrderStatus] = None,
    current_user: dict = Depends(get_current_admin)
):
    """Get all orders (admin only)"""
    query = {}
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    
    # Enrich with user info
    result = []
    for o in orders:
        user = await db.users.find_one({"id": o["user_id"]}, {"full_name": 1, "email": 1})
        result.append(OrderResponse(
            **o,
            user_name=user.get("full_name") if user else None,
            user_email=user.get("email") if user else None
        ))
    
    return result


@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: OrderStatus,
    current_user: dict = Depends(get_current_admin)
):
    """Update order status (admin only)"""
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Status updated"}
