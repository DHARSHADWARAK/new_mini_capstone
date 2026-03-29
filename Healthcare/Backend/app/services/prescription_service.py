from app.repositories.prescription_repository import PrescriptionRepository
from app.repositories.appointment_repository import AppointmentRepository
from app.exceptions.custom_exceptions import AppException


class PrescriptionService:

    def __init__(self):
        self.repo = PrescriptionRepository()
        self.appointment_repo = AppointmentRepository()

    async def create_prescription(self, doctor_id: str, data: dict):
        appointment = await self.appointment_repo.get_appointment_by_id(
            data["appointment_id"]
        )
        if not appointment:
            raise AppException("Appointment not found", 404)

        if appointment["doctor_id"] != doctor_id:
            raise AppException("Unauthorized to create prescription", 403)

        existing = await self.repo.get_by_appointment_id(data["appointment_id"])
        if existing:
            raise AppException("Prescription already exists", 400)

        data["doctor_id"] = doctor_id

        prescription = await self.repo.create_prescription(data)
        return prescription

    async def get_prescription(self, prescription_id: str):
        prescription = await self.repo.get_prescription_by_id(prescription_id)
        if not prescription:
            raise AppException("Prescription not found", 404)
        return prescription

    async def get_by_appointment(self, appointment_id: str):
        prescription = await self.repo.get_by_appointment_id(appointment_id)
        if not prescription:
            raise AppException("Prescription not found", 404)
        return prescription

    async def get_by_doctor(self, doctor_id: str):
        return await self.repo.get_by_doctor_id(doctor_id)