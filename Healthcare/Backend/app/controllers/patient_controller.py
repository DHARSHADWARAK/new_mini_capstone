from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import require_role
from app.services.user_service import UserService
from app.services.appointment_service import AppointmentService
from app.services.prescription_service import PrescriptionService


router = APIRouter(prefix="/patient", tags=["Patient"])

user_service = UserService()
appointment_service = AppointmentService()
prescription_service = PrescriptionService()


@router.get("/me")
async def get_profile(user=Depends(require_role("patient"))):
    return await user_service.get_user(user["user_id"])


@router.get("/appointments")
async def get_my_appointments(user=Depends(require_role("patient"))):
    return await appointment_service.get_patient_appointments(user["user_id"])


@router.get("/prescriptions")
async def get_my_prescriptions(user=Depends(require_role("patient"))):
    appointments = await appointment_service.get_patient_appointments(user["user_id"])

    result = []
    for a in appointments:
        p = await prescription_service.get_by_appointment(a["id"])
        if p:
            result.append(p)

    return result