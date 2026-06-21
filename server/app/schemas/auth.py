from pydantic import BaseModel, Field, field_validator


class AuthBase(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if "@" not in normalized or normalized.startswith("@") or normalized.endswith("@"):
            raise ValueError("Invalid email address")
        return normalized


class RegisterRequest(AuthBase):
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8, max_length=128)


class RegisterResponse(BaseModel):
    message: str
    user: dict[str, str]
    access_token: str
    token_type: str = "bearer"


class LoginRequest(AuthBase):
    password: str = Field(..., min_length=8, max_length=128)


class LoginResponse(BaseModel):
    message: str
    user: dict[str, str]
    access_token: str
    token_type: str = "bearer"


class UserRecord(AuthBase):
    user_id: str
    full_name: str
    password_hash: str
    created_at: str
