from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings
import hashlib
from passlib.context import CryptContext

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _truncate_password(password: str) -> bytes:
    # Convert to bytes and safely truncate to 72 bytes
    return password.encode("utf-8")[:72]

def hash_password(password: str):
    truncated = _truncate_password(password)
    return pwd_context.hash(truncated)

def verify_password(password: str, hashed_password: str) -> bool:
    truncated = _truncate_password(password)
    return pwd_context.verify(truncated, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)

    to_encode.update({"exp": expire})

    token = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm="HS256"
    )
    return token


def decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload
    except JWTError:
        return None