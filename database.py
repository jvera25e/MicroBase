import os
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Obtener URL desde .env o Vercel. Si no existe, usa localhost.
db_url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or "postgresql://postgres:postgres@localhost/microbase"

# SQLAlchemy 2.0 requiere que el protocolo sea 'postgresql://' y no 'postgres://'
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

SQLALCHEMY_DATABASE_URL = db_url

# Para Postgres, ya NO se necesita el argument 'connect_args={"check_same_thread": False}'
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
