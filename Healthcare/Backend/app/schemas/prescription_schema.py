from pydantic import BaseModel
from typing import List


class Medicine(BaseModel):
    name: str
    dosage: str
    days: int


class PrescriptionCreate(BaseModel):
    appointment_id: str
    notes: str
    medicines: List[Medicine]


class PrescriptionResponse(BaseModel):
    id: str
    appointment_id: str
    doctor_id: str
    notes: str
    medicines: List[Medicine]