"""Check and recreate full Supabase schema, then seed."""
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

with engine.connect() as conn:
    tables = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname='public'")).fetchall()
    print("Tables:", [t[0] for t in tables])
    enums = conn.execute(text("SELECT typname FROM pg_type WHERE typtype='e'")).fetchall()
    print("Enums:", [e[0] for e in enums])
