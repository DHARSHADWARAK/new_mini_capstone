from fastapi import APIRouter, HTTPException
from app.services.auth_service import AuthService
from app.schemas.auth_schema import LoginRequest, AuthResponse
from app.schemas.user_schema import UserCreate, UserResponse
from app.exceptions.custom_exceptions import AppException


router = APIRouter(prefix="/auth", tags=["Auth"])

service = AuthService()


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    try:
        created_user = await service.register(user.dict())
        return created_user
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest):
    try:
        user = await service.login(data.email, data.password)
        return user
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)