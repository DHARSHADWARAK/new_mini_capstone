from pydantic import BaseModel
from typing import List


class DoctorCreate(BaseModel):
    specialization: str
    experience: int
    availability: List[str]


class DoctorResponse(BaseModel):
    id: str
    user_id: str
    specialization: str
    experience: int
    availability: List[str]