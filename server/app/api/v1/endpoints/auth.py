from fastapi import APIRouter, Header, HTTPException, status

from app.schemas.auth import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse
from app.services.auth import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
    UserNotExistsError,
    authenticate_user,
    create_access_token,
    create_user,
    get_user_from_token,
)

router = APIRouter()


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest) -> RegisterResponse:
    try:
        user = create_user(payload)
    except UserAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    return RegisterResponse(
        message="User registered successfully",
        user={
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
        },
        access_token=create_access_token(user),
    )
    
@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login_user(payload: LoginRequest) -> LoginResponse:
    try:
        user = authenticate_user(payload)
    except UserNotExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    return LoginResponse(
        message="User logged in successfully",
        user={
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
        },
        access_token=create_access_token(user),
    )


@router.get("/me", status_code=status.HTTP_200_OK)
def get_current_user(authorization: str | None = Header(default=None)) -> dict[str, dict[str, str]]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
        )

    token = authorization.split("Bearer ", 1)[1].strip()

    try:
        user = get_user_from_token(token)
    except UserNotExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    return {
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
        }
    }
