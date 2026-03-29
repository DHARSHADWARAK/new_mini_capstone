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


@router.get("/", response_model=list[DoctorResponse])
async def get_all_doctors():
    try:
        doctors = await service.get_all_doctors()
        return doctors

    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)



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