from bson import ObjectId
from app.core.database import db


class UserRepository:

    def __init__(self):
        self.collection = db["users"]

    async def create_user(self, user_data: dict):
        result = await self.collection.insert_one(user_data)
        user = await self.collection.find_one({"_id": result.inserted_id})
        return self._serialize(user)

    async def get_user_by_email(self, email: str):
        user = await self.collection.find_one({"email": email})
        return self._serialize(user)

    async def get_user_by_id(self, user_id: str):
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        return self._serialize(user)

    def _serialize(self, user):
        if not user:
            return None
        user["id"] = str(user["_id"])
        del user["_id"]
        return user