from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum


class Role(str, Enum):
    admin = "admin"
    doctor = "doctor"
    patient = "patient"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: Role
    is_approved: bool


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None