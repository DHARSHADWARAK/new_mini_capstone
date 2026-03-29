from pydantic import BaseModel
from typing import Optional

class Medicine(BaseModel):
    name:str
    dosage:str
    days:int

class Prescription(BaseModel):
    id:Optional[str]
    appointment_id:Optional[str]
    doctor_id:Optional[str]
    notes:str
    medicines:list[Medicine]