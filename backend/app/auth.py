from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
import jwt
import os

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

def get_current_user(token=Depends(security)):
    try:
        payload = jwt.decode(
            token.credentials,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload["sub"]   # user_id (UUID)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
