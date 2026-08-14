FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway injects $PORT at runtime; fall back to 8501 for local docker-compose
EXPOSE 8501

CMD sh -c "streamlit run app.py --server.port=${PORT:-8501} --server.address=0.0.0.0"
