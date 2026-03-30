from app.repositories.doctor_repository import DoctorRepository
from app.repositories.user_repository import UserRepository
from app.exceptions.custom_exceptions import AppException

class DoctorService:

    def __init__(self):
        self.repo = DoctorRepository()
        self.user_repo = UserRepository()

    async def create_doctor_profile(self, user_id: str, doctor_data: dict):
        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            raise AppException("User not found", 404)

        if user["role"] != "doctor":
            raise AppException("User is not a doctor", 400)

        existing = await self.repo.get_by_user_id(user_id)
        if existing:
            raise AppException("Doctor profile already exists", 400)

        doctor_data["user_id"] = user_id

        doctor = await self.repo.create_doctor(doctor_data)
        return doctor

    async def get_doctor(self, doctor_id: str):
        doctor = await self.repo.get_doctor_by_id(doctor_id)
        if not doctor:
            raise AppException("Doctor not found", 404)
        return doctor

    async def get_by_user(self, user_id: str):
        doctor = await self.repo.get_by_user_id(user_id)
        if not doctor:
            raise AppException("Doctor profile not found", 404)
        return doctor
    async def get_all_doctors(self):
        doctors = await self.user_repo.get_users_by_role("doctor")

        # format for response
        result = []
        for doc in doctors:
            result.append({
                "id": str(doc["_id"]),
                "name": doc.get("name"),
                "email": doc.get("email"),
                "role": doc.get("role"),
                "is_approved": doc.get("is_approved", False)
            })

        return result

    async def update_doctor(self, doctor_id: str, update_data: dict):
        doctor = await self.repo.get_doctor_by_id(doctor_id)
        if not doctor:
            raise AppException("Doctor not found", 404)

        updated = await self.repo.update_doctor(doctor_id, update_data)
        return updated