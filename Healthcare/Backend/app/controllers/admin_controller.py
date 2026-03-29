from fastapi import APIRouter, HTTPException,Depends
from app.core.dependencies import require_role
from app.repositories.user_repository import UserRepository
from app.exceptions.custom_exceptions import AppException


router = APIRouter(prefix="/admin", tags=["Admin"])

repo = UserRepository()


@router.get("/users")
async def get_all_users(user=Depends(require_role("admin"))):
    try:
        cursor = repo.collection.find()
        users = []

        async for u in cursor:
            u["id"] = str(u["_id"])
            del u["_id"]
            users.append(u)

        return users

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, user=Depends(require_role("admin"))):
    try:
        await repo.collection.delete_one({"_id": ObjectId(user_id)})
        return {"message": "User deleted"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from bson import ObjectId
from app.core.database import db



@router.put("/doctors/{user_id}/approve")
async def approve_doctor(
    user_id: str,
    user=Depends(require_role("admin"))
):
    await db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_approved": True}}
    )

    return {"message": "Doctor approved"}