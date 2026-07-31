from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    username: str
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    login_days: int = 1
    coding_days: Optional[int] = 0
    practice_count: Optional[int] = 0

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str

class OAuthLoginRequest(BaseModel):
    provider: str
    email: EmailStr
    username: Optional[str] = None
