FROM python:3.12-slim

WORKDIR /app

RUN echo 'Acquire::https::Verify-Peer "false";' > /etc/apt/apt.conf.d/99mysettings \
    && echo 'Acquire::https::Verify-Host "false";' >> /etc/apt/apt.conf.d/99mysettings \
    && echo 'Acquire::AllowInsecureRepositories "true";' >> /etc/apt/apt.conf.d/99mysettings \
    && echo 'Acquire::AllowDowngradeToInsecureRepositories "true";' >> /etc/apt/apt.conf.d/99mysettings \
    && sed -i 's/deb.debian.org/mirrors.kernel.org/g' /etc/apt/sources.list || true \
    && if [ -f /etc/apt/sources.list.d/debian.sources ]; then sed -i 's/deb.debian.org/mirrors.kernel.org/g' /etc/apt/sources.list.d/debian.sources; fi \
    && sed -i 's/http:/https:/g' /etc/apt/sources.list || true \
    && if [ -f /etc/apt/sources.list.d/debian.sources ]; then sed -i 's/http:/https:/g' /etc/apt/sources.list.d/debian.sources; fi \
    && apt-get update --allow-insecure-repositories \
    && apt-get install -y --allow-unauthenticated \
    libpq-dev \
    gcc \
    g++ \
    default-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js without using apt-get to avoid repository 403 errors
RUN python -c "import urllib.request; urllib.request.urlretrieve('https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.gz', 'node.tar.gz')" \
    && tar -xzf node.tar.gz -C /usr/local --strip-components=1 \
    && rm node.tar.gz

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port for FastAPI
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
