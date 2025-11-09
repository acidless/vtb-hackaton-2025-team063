import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

_MAX_PASSWORD_BYTES = 72


def _prepare_password_for_bcrypt(password: str) -> str:
    """
    Prepare password for bcrypt hashing.
    If password exceeds 72 bytes, pre-hash it with SHA-256 to ensure
    it fits within bcrypt's 72-byte limit.
    """
    password_bytes = password.encode("utf-8")
    if len(password_bytes) <= _MAX_PASSWORD_BYTES:
        return password
    
    # For passwords longer than 72 bytes, pre-hash with SHA-256
    # SHA-256 always produces 32 bytes (64 hex characters)
    # This ensures the input to bcrypt is always <= 72 bytes
    sha256_hash = hashlib.sha256(password_bytes).hexdigest()
    return sha256_hash


def verify_password(plain_password: str, password_hash: str) -> bool:
    """
    Verify a password against a hash.
    Handles both regular bcrypt hashes and pre-hashed passwords.
    """
    # Check if the hash is from a pre-hashed password (starts with $2b$ or $2a$)
    # We need to prepare the password the same way it was hashed
    prepared_password = _prepare_password_for_bcrypt(plain_password)
    return pwd_context.verify(prepared_password, password_hash)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    For passwords longer than 72 bytes, pre-hashes with SHA-256 first.
    """
    prepared_password = _prepare_password_for_bcrypt(password)
    return pwd_context.hash(prepared_password)


def create_access_token(
    subject: dict[str, Any], expires_delta: timedelta | None = None
) -> tuple[str, int]:
    delta = expires_delta or timedelta(minutes=settings.jwt_access_token_expire_minutes)
    expire_at = datetime.now(timezone.utc) + delta
    to_encode = subject.copy()
    to_encode.update({"exp": int(expire_at.timestamp())})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt, int(delta.total_seconds())


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError as exc:
        msg = "Невалидный токен"
        raise ValueError(msg) from exc