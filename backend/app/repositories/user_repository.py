from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_email(db: Session, email: str):

    statement = select(User).where(
        User.email == email
    )

    return db.scalar(statement)


def get_user_by_username(db: Session, username: str):

    statement = select(User).where(
        User.username == username
    )

    return db.scalar(statement)


def get_user_by_id(db: Session, user_id: int):

    statement = select(User).where(
        User.id == user_id
    )

    return db.scalar(statement)


def get_user_by_login(db: Session, value: str):

    statement = select(User).where(
        (User.email == value) |
        (User.username == value)
    )

    return db.scalar(statement)


def create_user(db: Session, user: User):

    db.add(user)

    db.commit()

    db.refresh(user)

    return user