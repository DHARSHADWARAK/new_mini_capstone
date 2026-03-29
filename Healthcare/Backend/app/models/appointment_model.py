from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class Status(str,Enum):
    booked="booked"
    completed="completed"
    cancelled="cancelled"

class Appointment(BaseModel):
    id:Optional[str]
    patient_id:Optional[str]
    doctor_id:Optional[str]
    appointment_time:datetime
    status:Status