import base64
import hashlib
import hmac
import os
from datetime import datetime, timezone
from uuid import uuid4

from botocore.exceptions import ClientError

from app.schemas.auth import LoginRequest, RegisterRequest, UserRecord
from app.services.db.dynamodb import get_users_table

PBKDF2_ITERATIONS = 100_000
SALT_SIZE = 16


class UserAlreadyExistsError(Exception):
    pass


class UserNotExistsError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


def hash_password(password: str) -> str:
    salt = os.urandom(SALT_SIZE)
    derived_key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS,
    )
    return (
        f"pbkdf2_sha256${PBKDF2_ITERATIONS}$"
        f"{base64.b64encode(salt).decode('utf-8')}$"
        f"{base64.b64encode(derived_key).decode('utf-8')}"
    )


def verify_password(password: str, password_hash: str) -> bool:
    print("password",password)
    print("password hash",password_hash)
    algorithm, iterations, encoded_salt, encoded_hash = password_hash.split("$", 3)
    if algorithm != "pbkdf2_sha256":
        return False

    derived_key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        base64.b64decode(encoded_salt),
        int(iterations),
    )
    return hmac.compare_digest(
        base64.b64encode(derived_key).decode("utf-8"),
        encoded_hash,
    )


def get_user_by_email(email: str) -> dict | None:
    response = get_users_table().get_item(Key={"email": email.lower()})
    item = response.get("Item")
    if not item:
        return None
    return UserRecord.model_validate(item)


def create_user(payload: RegisterRequest) -> UserRecord:
    email = payload.email.lower()

    if get_user_by_email(email):
        raise UserAlreadyExistsError(f"User with email {email} already exists")

    user = UserRecord(
        user_id=str(uuid4()),
        full_name=payload.full_name,
        email=email,
        password_hash=hash_password(payload.password),
        created_at=datetime.now(timezone.utc).isoformat(),
    )

    try:
        get_users_table().put_item(
            Item=user.model_dump(mode="json"),
            ConditionExpression="attribute_not_exists(email)",
        )
    except ClientError as exc:
        error_code = exc.response.get("Error", {}).get("Code")
        if error_code == "ConditionalCheckFailedException":
            raise UserAlreadyExistsError(f"User with email {email} already exists") from exc
        raise

    return user


def authenticate_user(payload: LoginRequest) -> UserRecord:
    user = get_user_by_email(payload.email)
    if not user:
        raise UserNotExistsError(f"User with email {payload.email.lower()} does not exist")

    if not verify_password(payload.password, user.password_hash):
        raise InvalidCredentialsError("Invalid email or password")

    return user


def create_access_token(user: UserRecord) -> str:
    return f"user:{user.email}"


def get_user_from_token(token: str) -> UserRecord:
    if not token.startswith("user:"):
        raise InvalidCredentialsError("Invalid authentication token")

    email = token.split("user:", 1)[1].strip().lower()
    user = get_user_by_email(email)

    if not user:
        raise UserNotExistsError(f"User with email {email} does not exist")

    return user
