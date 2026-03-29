from pydantic import BaseModel,EmailStr
from typing import Optional
from enum import Enum
class roles(str,Enum):
    admin="admin"
    doctor="doctor"
    patient="patient"

class User(BaseModel):
    id:Optional[str]
    name:str
    email:EmailStr
    password:str
    role:roles
    is_approved:bool