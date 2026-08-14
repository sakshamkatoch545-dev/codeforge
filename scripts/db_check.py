import psycopg2

conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/codeforge")
cur = conn.cursor()
cur.execute("SELECT title, driver_code FROM problems WHERE slug = 'valid-parentheses'")
row = cur.fetchone()
print("TITLE:", row[0])
print("DRIVER CODE:")
print(row[1])
