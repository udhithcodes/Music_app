from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.enums import UserRole


class RegisterRequest(BaseModel):

    username: str = Field(min_length=3, max_length=50)

    email: EmailStr

    password: str = Field(min_length=8, max_length=128)

    role: UserRole = UserRole.USER

    @field_validator("role")
    @classmethod
    def validate_role(cls, value):

        if value == UserRole.ADMIN:
            raise ValueError("Admin registration is not allowed")

        return value


class LoginRequest(BaseModel):

    username_or_email: str

    password: str


class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"


class UserResponse(BaseModel):

    id: int
    username: str
    email: EmailStr
    role: UserRole
    is_active: bool

    model_config = {
        "from_attributes": True
    }