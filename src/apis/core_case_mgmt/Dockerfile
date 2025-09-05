FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PORT=8080

# Expose the port
EXPOSE $PORT

# Run the application using Gunicorn
CMD exec gunicorn --bind :$PORT --workers 2 --threads 4 --timeout 0 main:app
