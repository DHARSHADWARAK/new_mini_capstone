from fastapi import APIRouter, HTTPException,Depends
from app.services.doctor_service import DoctorService
from app.schemas.doctor_schema import DoctorCreate, DoctorResponse
from app.exceptions.custom_exceptions import AppException
from app.core.dependencies import require_role


router = APIRouter(prefix="/doctors", tags=["Doctors"])

service = DoctorService()



@router.post("/", response_model=DoctorResponse)
async def create_doctor(
    data: DoctorCreate,
    user=Depends(require_role("doctor"))
):
    user_id = user["user_id"]

    return await service.create_doctor_profile(
        user_id,
        data.dict()
    )

@router.put("/{doctor_id}", response_model=DoctorResponse)
async def update_doctor(
    doctor_id: str,
    data: DoctorCreate,
    user=Depends(require_role("doctor"))
):
    return await service.update_doctor(
        doctor_id,
        data.dict()
    )


@router.get("/user/{user_id}", response_model=DoctorResponse)
async def get_by_user(user_id: str):
    try:
        doctor = await service.get_by_user(user_id)
        return doctor

    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

from bson import ObjectId
async def get_all_doctors(self):
    doctors = await self.db["users"].find({"role": "doctor"}).to_list(100)

    # Convert ObjectId → string
    for doc in doctors:
        doc["_id"] = str(doc["_id"])

    return doctors

service = DoctorService()

@router.get("/")
async def get_all_doctors():
    return await service.get_all_doctors()

@router.put("/{doctor_id}", response_model=DoctorResponse)
async def update_doctor(
    doctor_id: str,
    data: DoctorCreate,
    user=Depends(require_role("doctor"))   
):
    updated = await service.update_doctor(
        doctor_id,
        data.dict()
    )
    return updated