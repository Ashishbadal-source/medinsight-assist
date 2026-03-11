FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    gcc \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Copy requirements first
COPY --chown=user backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and ecg_pipeline
COPY --chown=user backend/ ./backend/
COPY --chown=user ecg_pipeline/ ./ecg_pipeline/

# Copy .env if exists
COPY --chown=user .env* ./

WORKDIR /app/backend

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]