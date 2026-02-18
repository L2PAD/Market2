"""
Admin Module - Analytics & Management Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone, timedelta

from core.db import db
from core.security import get_current_admin
from analytics_service import AnalyticsService

router = APIRouter(prefix="/admin", tags=["Admin"])

analytics_service = AnalyticsService()


class AdminStats(BaseModel):
    total_revenue: float
    total_orders: int
    total_users: int
    total_products: int
    pending_orders: int
    new_users_today: int


class UserListItem(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: datetime
    orders_count: int = 0


@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(current_user: dict = Depends(get_current_admin)):
    """Get admin dashboard stats"""
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Total revenue from completed orders
    pipeline = [
        {"$match": {"status": {"$in": ["delivered", "completed"]}}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return AdminStats(
        total_revenue=total_revenue,
        total_orders=await db.orders.count_documents({}),
        total_users=await db.users.count_documents({}),
        total_products=await db.products.count_documents({}),
        pending_orders=await db.orders.count_documents({"status": "pending"}),
        new_users_today=await db.users.count_documents({"created_at": {"$gte": today}})
    )


@router.get("/users", response_model=List[UserListItem])
async def get_all_users(current_user: dict = Depends(get_current_admin)):
    """Get all users"""
    users = await db.users.find({}, {"_id": 0, "hashed_password": 0}).to_list(1000)
    
    result = []
    for u in users:
        orders_count = await db.orders.count_documents({"user_id": u["id"]})
        result.append(UserListItem(**u, orders_count=orders_count))
    
    return result


@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str,
    current_user: dict = Depends(get_current_admin)
):
    """Update user role"""
    if role not in ["customer", "seller", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"role": role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Role updated"}


@router.get("/analytics/revenue")
async def get_revenue_analytics(
    days: int = 30,
    current_user: dict = Depends(get_current_admin)
):
    """Get revenue analytics"""
    return await analytics_service.get_revenue_analytics(days)


@router.get("/analytics/top-products")
async def get_top_products(
    limit: int = 10,
    current_user: dict = Depends(get_current_admin)
):
    """Get top selling products"""
    return await analytics_service.get_top_products(limit)


@router.get("/analytics/categories")
async def get_category_distribution(current_user: dict = Depends(get_current_admin)):
    """Get sales by category"""
    return await analytics_service.get_category_distribution()


@router.get("/analytics/user-growth")
async def get_user_growth(
    days: int = 30,
    current_user: dict = Depends(get_current_admin)
):
    """Get user registration growth"""
    return await analytics_service.get_user_growth(days)


@router.get("/analytics/order-status")
async def get_order_status_distribution(current_user: dict = Depends(get_current_admin)):
    """Get order status distribution"""
    pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    result = await db.orders.aggregate(pipeline).to_list(10)
    return {r["_id"]: r["count"] for r in result}
