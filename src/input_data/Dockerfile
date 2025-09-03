# build from src/backend/ directory
# docker build -t input-data -f input_data/Dockerfile .
FROM python:3.13-slim

WORKDIR /app

# Create a non-privileged user and group
RUN addgroup --system --gid 1000 nonroot
RUN adduser --system --uid 1000 --ingroup nonroot nonroot

# Copy only requirements to leverage layer caching
COPY input_data/requirements.txt .

# Install dependencies directly
RUN pip install --no-cache-dir -r requirements.txt

# This is built from the backend directory context
COPY input_data ./src/input_data
COPY utils ./src/utils

# Set environment variables
ENV PYTHONPATH=/app

ENV PORT=8080

EXPOSE $PORT

# Switch to the non-privileged user
USER nonroot:nonroot

# Change to the input_data directory and run the application using Gunicorn
# The application is in src/backend/input_data/main.py and the Flask app object is named `app`.
WORKDIR /app/src/input_data

CMD ["python", "-m", "gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--threads", "4", "--log-level", "info", "main:app"]