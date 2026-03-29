from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.doctor_repository import DoctorRepository
from app.exceptions.custom_exceptions import AppException


class AppointmentService:

    def __init__(self):
        self.repo = AppointmentRepository()
        self.doctor_repo = DoctorRepository()

    async def create_appointment(self, patient_id: str, data: dict):
        doctor = await self.doctor_repo.get_doctor_by_id(data["doctor_id"])
        if not doctor:
            raise AppException("Doctor not found", 404)

        data["patient_id"] = patient_id

        data["status"] = "booked"

        appointment = await self.repo.create_appointment(data)
        return appointment

    async def get_appointment(self, appointment_id: str):
        appointment = await self.repo.get_appointment_by_id(appointment_id)
        if not appointment:
            raise AppException("Appointment not found", 404)
        return appointment

    async def get_patient_appointments(self, patient_id: str):
        return await self.repo.get_by_patient_id(patient_id)

    async def get_doctor_appointments(self, doctor_id: str):
        return await self.repo.get_by_doctor_id(doctor_id)

    async def update_status(self, doctor_id: str, appointment_id: str, status: str):
        appointment = await self.repo.get_appointment_by_id(appointment_id)
        if not appointment:
            raise AppException("Appointment not found", 404)

        if appointment["doctor_id"] != doctor_id:
            raise AppException("Unauthorized to update", 403)

        updated = await self.repo.update_status(appointment_id, status)
        return updated