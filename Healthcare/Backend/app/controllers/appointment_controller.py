from fastapi import APIRouter, HTTPException, Depends
from app.services.appointment_service import AppointmentService
from app.schemas.appointment_schema import AppointmentCreate, AppointmentResponse
from app.exceptions.custom_exceptions import AppException
from app.core.dependencies import require_role
from app.repositories.doctor_repository import DoctorRepository

repo = DoctorRepository()

router = APIRouter(prefix="/appointments", tags=["Appointments"])

service = AppointmentService()



@router.post("/", response_model=AppointmentResponse)
async def book_appointment(
    data: AppointmentCreate,
    user=Depends(require_role("patient"))
):
    try:
        patient_id = user["user_id"]

        appointment = await service.create_appointment(
            patient_id,
            data.dict()
        )
        return appointment

    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    

@router.get("/my", response_model=list[AppointmentResponse])
async def get_my_appointments(
    user=Depends(require_role("patient"))   
):
    try:
        patient_id = user["user_id"]

        appointments = await service.get_patient_appointments(patient_id)
        return appointments

    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

@router.get("/doctor/{doctor_id}", response_model=list[AppointmentResponse])
async def get_doctor_appointments(doctor_id: str):
    try:
        appointments = await service.get_doctor_appointments(doctor_id)
        return appointments

    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{appointment_id}")
async def update_status(
    appointment_id: str,
    status: str,
    user=Depends(require_role("doctor"))
):
    doctor = await repo.get_by_user_id(user["user_id"])

    doctor_id = doctor["id"]   

    return await service.update_status(
        doctor_id,
        appointment_id,
        status
    )