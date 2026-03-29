from bson import ObjectId
from app.core.database import db


class AppointmentRepository:

    def __init__(self):
        self.collection = db["appointments"]

    async def create_appointment(self, appointment_data: dict):
        appointment_data["patient_id"] = str(appointment_data["patient_id"])
        result = await self.collection.insert_one(appointment_data)
        appointment = await self.collection.find_one({"_id": result.inserted_id})
        return self._serialize(appointment)

    async def get_appointment_by_id(self, appointment_id: str):
        appointment = await self.collection.find_one(
            {"_id": ObjectId(appointment_id)}
        )
        return self._serialize(appointment)

    async def get_by_patient_id(self, patient_id: str):
        cursor = self.collection.find({"patient_id": str(patient_id)})
        appointments = []
        async for a in cursor:
            appointments.append(self._serialize(a))
        return appointments

    async def get_by_doctor_id(self, doctor_id: str):
        cursor = self.collection.find({"doctor_id": doctor_id})
        appointments = []
        async for a in cursor:
            appointments.append(self._serialize(a))
        return appointments

    async def update_status(self, appointment_id: str, status: str):
        await self.collection.update_one(
            {"_id": ObjectId(appointment_id)},
            {"$set": {"status": status}}
        )
        updated = await self.collection.find_one({"_id": ObjectId(appointment_id)})
        return self._serialize(updated)

    async def delete_appointment(self, appointment_id: str):
        await self.collection.delete_one({"_id": ObjectId(appointment_id)})
        return {"message": "Appointment deleted"}

    def _serialize(self, appointment):
        if not appointment:
            return None
        appointment["id"] = str(appointment["_id"])
        del appointment["_id"]
        return appointment