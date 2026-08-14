import psycopg2

conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/codeforge")
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
print([row[0] for row in cur.fetchall()])
