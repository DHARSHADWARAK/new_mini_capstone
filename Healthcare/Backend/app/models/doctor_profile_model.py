from pydantic import BaseModel
from typing import Optional

class Doctor(BaseModel):
    id:Optional[str]
    user_id:Optional[str]
    specialization:str
    experience:int
    availability:list[str]