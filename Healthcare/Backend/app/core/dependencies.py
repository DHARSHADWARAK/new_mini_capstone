from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token
from app.exceptions.custom_exceptions import AppException


security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload


def require_role(role: str):
    def role_checker(user=Depends(get_current_user)):
        if user["role"] != role:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return role_checker