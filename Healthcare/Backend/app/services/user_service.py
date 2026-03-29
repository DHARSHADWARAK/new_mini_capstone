from app.repositories.user_repository import UserRepository
from app.exceptions.custom_exceptions import AppException
from app.core.security import hash_password, verify_password


class UserService:

    def __init__(self):
        self.repo = UserRepository()

    async def register_user(self, user_data: dict):
        existing_user = await self.repo.get_user_by_email(user_data["email"])
        if existing_user:
            raise AppException("User already exists", 400)

        user_data["password"] = hash_password(user_data["password"])

        user_data["is_approved"] = False if user_data["role"] == "doctor" else True

        user = await self.repo.create_user(user_data)
        return user

    async def login_user(self, email: str, password: str):
        user = await self.repo.get_user_by_email(email)
        if not user:
            raise AppException("Invalid email or password", 401)

        if not verify_password(password, user["password"]):
            raise AppException("Invalid email or password", 401)

        if user["role"] == "doctor" and not user["is_approved"]:
            raise AppException("Doctor not approved yet", 403)

        return user

    async def get_user(self, user_id: str):
        user = await self.repo.get_user_by_id(user_id)
        if not user:
            raise AppException("User not found", 404)
        return user