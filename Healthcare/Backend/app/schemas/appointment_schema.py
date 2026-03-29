from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum


class Status(str, Enum):
    booked = "booked"
    completed = "completed"
    cancelled = "cancelled"


class AppointmentCreate(BaseModel):
    doctor_id: str
    appointment_time: datetime


class AppointmentResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    appointment_time: datetime
    status: Status