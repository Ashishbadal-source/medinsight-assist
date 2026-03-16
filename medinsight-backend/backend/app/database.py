from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "postgresql://med_user:med123@localhost:5432/medinsight_db"
# DATABASE_URL = "postgresql://postgres:vishu@localhost:5432/medical"
DATABASE_URL =  "postgresql://postgres:vishu_2008@db.yenguyiwjitciliilqet.supabase.co:5432/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
