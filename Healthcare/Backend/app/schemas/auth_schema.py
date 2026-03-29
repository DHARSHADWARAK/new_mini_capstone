from pydantic import BaseModel, EmailStr
from app.schemas.user_schema import UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    user:UserResponse


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"