"""
Patches the Supabase database to add any missing columns to the problem table,
then seeds all problems. Run with DATABASE_URL set in environment.
"""
import os
import psycopg2
from sqlalchemy import create_engine, text

# Build engine using explicit keyword args to avoid @ in password breaking URL parsing
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


COLUMNS_TO_ADD = [
    ("tags",         "JSON DEFAULT ('[]'::json)"),
    ("companies",    "JSON DEFAULT ('[]'::json)"),
    ("constraints",  "JSON DEFAULT ('[]'::json)"),
    ("hints",        "JSON DEFAULT ('[]'::json)"),
    ("notes",        "TEXT"),
    ("examples",     "JSON DEFAULT ('[]'::json)"),
    ("driver_code",  "JSON"),
]

print("=== Checking problem table columns ===")
with engine.begin() as conn:
    rows = conn.execute(text(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name='problem' ORDER BY ordinal_position"
    )).fetchall()
    existing = [r[0] for r in rows]
    print("Existing columns:", existing)

    for col_name, col_def in COLUMNS_TO_ADD:
        if col_name not in existing:
            conn.execute(text(f"ALTER TABLE problem ADD COLUMN {col_name} {col_def}"))
            print(f"  Added: {col_name}")
        else:
            print(f"  Already exists: {col_name}")

print("\n=== Schema patch complete! Now seeding problems... ===\n")

# Now run seed_db
import sys
sys.path.insert(0, os.path.dirname(__file__))
exec(open(os.path.join(os.path.dirname(__file__), "seed_db.py")).read())
