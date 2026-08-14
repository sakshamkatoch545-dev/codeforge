"""Drop custom enums and run alembic."""
import os
import subprocess
from sqlalchemy import create_engine, text

engine = create_engine(
    "postgresql+psycopg2://",
    connect_args={
        "host": "db.yxfgjecejatjvrfyvqvh.supabase.co",
        "port": 5432,
        "dbname": "postgres",
        "user": "postgres",
        "password": "Saksham@123",
        "sslmode": "require",
    }
)

with engine.begin() as conn:
    print("Dropping custom enums...")
    conn.execute(text("DROP TYPE IF EXISTS difficultyenum CASCADE"))
    conn.execute(text("DROP TYPE IF EXISTS languageenum CASCADE"))
    conn.execute(text("DROP TYPE IF EXISTS submissionstatus CASCADE"))
    print("Enums dropped.")

print("Running alembic upgrade head...")
os.environ["DATABASE_URL"] = "postgresql://postgres:Saksham@123@db.yxfgjecejatjvrfyvqvh.supabase.co:5432/postgres"

# We must bypass the env parser again.
# The previous fix for env.py (replacing % with %%) only works if there is a % in the string,
# but the raw URL 'Saksham@123' does not have a %. It will have @ which is fine.
# But wait, earlier I modified env.py to handle the interpolation, which might still be there.
# Let's just run alembic.
