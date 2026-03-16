# from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
# from datetime import datetime
# from app.database import Base

# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     email = Column(String, unique=True)
#     password_hash = Column(String)
#     created_at = Column(DateTime, default=datetime.utcnow)

# class Report(Base):
#     __tablename__ = "reports"
#     id = Column(Integer, primary_key=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     report_type = Column(String)
#     file_path = Column(String)
#     scan_time = Column(DateTime, default=datetime.utcnow)

# class AnalysisResult(Base):
#     __tablename__ = "analysis_results"
#     id = Column(Integer, primary_key=True)
#     report_id = Column(Integer, ForeignKey("reports.id"))
#     summary = Column(String)
#     predicted_diseases = Column(JSON)
#     abnormal_values = Column(JSON)
#     confidence_score = Column(String)









from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String)
    age = Column(String)
    gender = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    report_type = Column(String)
    file_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("reports.id"))
    summary = Column(String)
    predicted_diseases = Column(JSON)
    abnormal_values = Column(JSON)
    confidence_score = Column(String)
