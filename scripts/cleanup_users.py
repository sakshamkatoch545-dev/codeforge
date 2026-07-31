import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.models.user import User

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def cleanup():
    db = SessionLocal()
    try:
        # Delete submissions by demo_user first
        demo_user = db.query(User).filter(User.username == "demo_user").first()
        if demo_user:
            print(f"Found demo_user with ID {demo_user.id}. Deleting submissions...")
            db.execute(text("DELETE FROM submission WHERE user_id = :uid"), {"uid": demo_user.id})
            db.commit()
            print("Deleting demo_user...")
            db.delete(demo_user)
            db.commit()
            print("demo_user deleted successfully.")
        else:
            print("demo_user not found.")
    except Exception as e:
        print(f"Error cleaning up database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    cleanup()
