from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
import jwt
import os

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

def get_current_user(token=Depends(security)):
    try:
        secret = SUPABASE_JWT_SECRET
        if not secret:
            raise HTTPException(status_code=500, detail="JWT secret not configured")
        if isinstance(secret, bytes):
            secret = secret.decode("utf-8")

        payload = jwt.decode(
            token.credentials,
            secret,
            algorithms=["HS256"],
            audience="authenticated",
            options={"verify_exp": True}
        )
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired — please login again")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")