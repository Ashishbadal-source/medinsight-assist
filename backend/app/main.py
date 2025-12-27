from fastapi import FastAPI
from app.database import engine
from app import models
from fastapi import Depends
from app.auth import get_current_user

app = FastAPI()

# models.Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Database connected successfully"}

@app.post("/reports")
def create_report(
    report_type: str,
    user_id=Depends(get_current_user)
):
    return {
        "status": "report saved",
        "user_id": user_id,
        "report_type": report_type
    }







# from app.auth import get_current_user
# from fastapi import Depends

# @app.get("/me")
# def get_me(user_id=Depends(get_current_user)):
#     return {
#         "user_id": user_id,
#         "message": "You are authenticated"
#     }
