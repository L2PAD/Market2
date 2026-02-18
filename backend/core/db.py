"""
Y-Store Marketplace - Database Connection
"""
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.DB_NAME]


async def init_db():
    """Create indexes on startup"""
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    await db.products.create_index("category_id")
    await db.products.create_index("seller_id")
    await db.products.create_index([("name", "text"), ("description", "text")])
    await db.categories.create_index("id", unique=True)
    await db.categories.create_index("slug", unique=True)
    await db.orders.create_index("id", unique=True)
    await db.orders.create_index("user_id")
    await db.reviews.create_index("product_id")
    await db.carts.create_index("user_id", unique=True)


async def close_db():
    """Close database connection"""
    client.close()
