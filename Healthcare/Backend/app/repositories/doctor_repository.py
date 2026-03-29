from bson import ObjectId
from app.core.database import db


class DoctorRepository:

    def __init__(self):
        self.collection = db["doctor_profiles"]

    async def create_doctor(self, doctor_data: dict):
        result = await self.collection.insert_one(doctor_data)
        doctor = await self.collection.find_one({"_id": result.inserted_id})
        return self._serialize(doctor)

    async def get_doctor_by_id(self, doctor_id: str):
        doctor = await self.collection.find_one(
            {"_id": ObjectId(doctor_id)}
        )
        return self._serialize(doctor)

    async def get_by_user_id(self, user_id: str):
        doctor = await self.collection.find_one({"user_id": user_id})
        return self._serialize(doctor)

    async def get_all_doctors(self):
        cursor = self.collection.find()
        doctors = []
        async for d in cursor:
            doctors.append(self._serialize(d))
        return doctors

    async def update_doctor(self, doctor_id: str, update_data: dict):
        await self.collection.update_one(
            {"_id": ObjectId(doctor_id)},
            {"$set": update_data}
        )
        updated = await self.collection.find_one({"_id": ObjectId(doctor_id)})
        return self._serialize(updated)

    async def delete_doctor(self, doctor_id: str):
        await self.collection.delete_one({"_id": ObjectId(doctor_id)})
        return {"message": "Doctor deleted"}

    def _serialize(self, doctor):
        if not doctor:
            return None
        doctor["id"] = str(doctor["_id"])
        del doctor["_id"]
        return doctor