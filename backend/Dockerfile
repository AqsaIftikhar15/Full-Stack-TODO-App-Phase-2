FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY ./src /app/src

# Copy initialization script
COPY initialize_db.py /app/

   # Set PYTHONPATH
ENV PYTHONPATH=/app

  # Create a startup script that properly uses the PORT environment variable
EXPOSE 7860
EXPOSE 8080

  # Start with default port for Hugging Face Spaces
CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
