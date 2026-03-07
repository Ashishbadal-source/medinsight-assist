# # # from fastapi import Depends, HTTPException
# # # from fastapi.security import HTTPBearer
# # # import jwt
# # # import os

# # # security = HTTPBearer()

# # # SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# # # def get_current_user(token=Depends(security)):
# # #     try:
# # #         payload = jwt.decode(
# # #             token.credentials,
# # #             SUPABASE_JWT_SECRET,
# # #             algorithms=["HS256"],
# # #             audience="authenticated"
# # #         )
# # #         return payload["sub"]   # user_id (UUID)
# # #     except Exception:
# # #         raise HTTPException(status_code=401, detail="Invalid token")







# # from fastapi import Depends, HTTPException
# # from fastapi.security import HTTPBearer
# # import jwt
# # import os

# # security = HTTPBearer()

# # SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# # def get_current_user(token=Depends(security)):
# #     try:
# #         payload = jwt.decode(
# #             token.credentials,
# #             SUPABASE_JWT_SECRET,
# #             algorithms=["HS256"],
# #             audience="authenticated",
# #             options={"verify_exp": True}
# #         )
# #         return payload["sub"]
# #     except jwt.ExpiredSignatureError:
# #         raise HTTPException(status_code=401, detail="Token expired — please login again")
# #     except jwt.InvalidTokenError as e:
# #         raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
# #     except Exception as e:
# #         raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")











# from fastapi import Depends, HTTPException
# from fastapi.security import HTTPBearer
# import jwt
# import os

# security = HTTPBearer()

# SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

# def get_current_user(token=Depends(security)):
#     try:
#         # Secret ko string ensure karo
#         secret = SUPABASE_JWT_SECRET
#         if isinstance(secret, bytes):
#             secret = secret.decode("utf-8")
        
#         payload = jwt.decode(
#             token.credentials,
#             secret,
#             algorithms=["HS256"],
#             audience="authenticated",
#         )
#         return payload["sub"]
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired — please login again")
#     except jwt.InvalidTokenError as e:
#         raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")










# from fastapi import Depends, HTTPException
# from fastapi.security import HTTPBearer
# import jwt
# import os
# from dotenv import load_dotenv

# # Root .env load karo
# load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

# security = HTTPBearer()

# SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

# def get_current_user(token=Depends(security)):
#     try:
#         secret = SUPABASE_JWT_SECRET
#         if isinstance(secret, bytes):
#             secret = secret.decode("utf-8")
#         # Token header se kid nikalo aur ignore karo
#         header = jwt.get_unverified_header(token.credentials)
#         # print("Token kid:", header.get('kid'))  # debug
        
#         payload = jwt.decode(
#             token.credentials,
#             secret,
#             algorithms=["HS256"],
#             audience="authenticated",
#             options={"verify_exp": False}  # testing ke liye
#         )
#         return payload["sub"]
#     except jwt.InvalidTokenError as e:
#         raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")















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
            options={"verify_exp": False}
        )
        return payload["sub"]
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")