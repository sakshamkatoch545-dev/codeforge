from datetime import datetime, timedelta, timezone
from typing import Any, Union
from jose import jwt
from app.core.config import settings

ALGORITHM = "HS256"

# Use bcrypt directly to avoid passlib/bcrypt version mismatch issues
try:
    import bcrypt as _bcrypt

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            plain_bytes = plain_password.encode('utf-8')
            # hashed_password may be a str; bcrypt.checkpw needs bytes
            hash_bytes = hashed_password.encode('utf-8') if isinstance(hashed_password, str) else hashed_password
            return _bcrypt.checkpw(plain_bytes, hash_bytes)
        except Exception:
            return False

    def get_password_hash(password: str) -> str:
        plain_bytes = password.encode('utf-8')
        salt = _bcrypt.gensalt(rounds=12)
        return _bcrypt.hashpw(plain_bytes, salt).decode('utf-8')

except ImportError:
    # Fallback to passlib if bcrypt isn't available directly
    from passlib.context import CryptContext
    _pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        safe = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return _pwd_context.verify(safe, hashed_password)

    def get_password_hash(password: str) -> str:
        safe = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return _pwd_context.hash(safe)


def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt
