from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest

from app.core.security import (
    hash_password,
    verify_password
)

from app.core.jwt import create_access_token

from app.repositories import user_repository


def register_user(
    db: Session,
    data: RegisterRequest
):

    if user_repository.get_user_by_email(db, data.email):

        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    if user_repository.get_user_by_username(db, data.username):

        raise HTTPException(
            status_code=409,
            detail="Username already exists"
        )

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role
    )

    try:

        return user_repository.create_user(db, user)

    except Exception:
        db.rollback()
        raise


def login_user(
    db: Session,
    data: LoginRequest
):

    user = user_repository.get_user_by_login(
        db,
        data.username_or_email
    )

    if not user or not verify_password(
        data.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password"
        )

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    return create_access_token(user.id)