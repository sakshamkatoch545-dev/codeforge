from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.schemas.user import OAuthLoginRequest

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not crud.user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Update login days based on calendar date
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    if not user.last_login or user.last_login.date() < now.date():
        user.login_days += 1
    user.last_login = now
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/oauth", response_model=schemas.Token)
def oauth_login(
    *,
    db: Session = Depends(deps.get_db),
    oauth_in: OAuthLoginRequest,
) -> Any:
    """
    Authenticate or Register user via OAuth provider (Google or GitHub).
    """
    user = crud.user.get_by_email(db, email=oauth_in.email)
    if not user:
        uname = oauth_in.username or oauth_in.email.split("@")[0]
        existing_uname = crud.user.get_by_username(db, username=uname)
        if existing_uname:
            import random
            uname = f"{uname}_{random.randint(100, 999)}"
        
        import secrets
        user_in = schemas.UserCreate(
            email=oauth_in.email,
            username=uname,
            password=secrets.token_hex(32),
        )
        user = crud.user.create(db, obj_in=user_in)

    if not crud.user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")

    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    if not user.last_login or user.last_login.date() < now.date():
        user.login_days += 1
    user.last_login = now
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
