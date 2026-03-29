from app.repositories.user_repository import UserRepository
from app.exceptions.custom_exceptions import AppException
from app.core.security import hash_password, verify_password

from app.core.security import create_access_token
class AuthService:

    def __init__(self):
        self.repo = UserRepository()

    async def register(self, data: dict):
        existing = await self.repo.get_user_by_email(data["email"])
        if existing:
            raise AppException("User already exists", 400)

        data["password"] = hash_password(data["password"])

        if data["role"] == "doctor":
            data["is_approved"] = False
        else:
            data["is_approved"] = True

        user = await self.repo.create_user(data)
        return user

    async def login(self, email: str, password: str):
        user = await self.repo.get_user_by_email(email)
        if not user:
            raise AppException("Invalid email or password", 401)

        if not verify_password(password, user["password"]):
            raise AppException("Invalid email or password", 401)

        if user["role"] == "doctor" and not user["is_approved"]:
            raise AppException("Doctor not approved yet", 403)

        token = create_access_token({
        "user_id": user["id"],
        "role": user["role"]
        })

        return {
            "access_token": token,
            "user": user
        }