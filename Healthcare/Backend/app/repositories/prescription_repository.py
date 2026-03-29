from bson import ObjectId
from app.core.database import db


class PrescriptionRepository:

    def __init__(self):
        self.collection = db["prescriptions"]

    async def create_prescription(self, prescription_data: dict):
        result = await self.collection.insert_one(prescription_data)
        prescription = await self.collection.find_one({"_id": result.inserted_id})
        return self._serialize(prescription)

    async def get_prescription_by_id(self, prescription_id: str):
        prescription = await self.collection.find_one(
            {"_id": ObjectId(prescription_id)}
        )
        return self._serialize(prescription)

    async def get_by_appointment_id(self, appointment_id: str):
        prescription = await self.collection.find_one(
            {"appointment_id": appointment_id}
        )
        return self._serialize(prescription)

    async def get_by_doctor_id(self, doctor_id: str):
        cursor = self.collection.find({"doctor_id": doctor_id})
        prescriptions = []
        async for p in cursor:
            prescriptions.append(self._serialize(p))
        return prescriptions

    def _serialize(self, prescription):
        if not prescription:
            return None
        prescription["id"] = str(prescription["_id"])
        del prescription["_id"]
        return prescription