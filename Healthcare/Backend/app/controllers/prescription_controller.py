from fastapi import APIRouter, HTTPException,Depends
from app.core.dependencies import require_role
from app.services.prescription_service import PrescriptionService
from app.schemas.prescription_schema import (
    PrescriptionCreate,
    PrescriptionResponse
)
from app.exceptions.custom_exceptions import AppException
from app.core.dependencies import get_current_user
from app.repositories.doctor_repository import DoctorRepository

doctor_repo = DoctorRepository()

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

service = PrescriptionService()


@router.post("/", response_model=PrescriptionResponse)
async def create_prescription(
    data: PrescriptionCreate,
    user=Depends(require_role("doctor"))
):
    doctor = await doctor_repo.get_by_user_id(user["user_id"])
    doctor_id = doctor["id"]

@router.get("/doctor", response_model=list[PrescriptionResponse])
async def get_my_prescriptions(
    user=Depends(require_role("doctor"))
):
    doctor = await doctor_repo.get_by_user_id(user["user_id"])

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    doctor_id = doctor["id"]

    return await service.get_by_doctor(doctor_id)
    return await service.create_prescription(
        doctor_id,
        data.dict()
    )

@router.get("/appointment/{appointment_id}", response_model=PrescriptionResponse)
async def get_by_appointment(
    appointment_id: str,
    user=Depends(get_current_user)
):
    return await service.get_by_appointment(appointment_id)


@router.get("/{prescription_id}", response_model=PrescriptionResponse)
async def get_prescription(
    prescription_id: str,
    user=Depends(get_current_user)
):
    return await service.get_prescription(prescription_id)



