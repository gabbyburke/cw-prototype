# 1. Builder Stage: Install dependencies with the full Python image
FROM python:3.11-slim AS builder

WORKDIR /app

# Create a non-privileged user and group
RUN addgroup --system --gid 1000 nonroot
RUN adduser --system --uid 1000 --ingroup nonroot nonroot

# Copy only requirements to leverage layer caching
COPY requirements.txt .

# Install dependencies into a wheelhouse
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# 2. Final Stage: Use a minimal distroless image
FROM gcr.io/distroless/python3-debian11

WORKDIR /app

# Copy the non-root user from the builder stage
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Copy installed dependencies from the builder stage
COPY --from=builder /wheels /wheels

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONPATH=/wheels
# Set a default port. Used only for local debugging. Cloud Run will override this at runtime.
ENV PORT=8080

# Expose the port for documentation purposes. This does not affect Cloud Run.
EXPOSE $PORT

# Switch to the non-privileged user
USER nonroot:nonroot

# Run the application using Gunicorn
# The application is assumed to be in a file named `main.py` and the
# Flask app object is named `app`.
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "--workers", "2", "--threads", "4", "--log-level", "info", "main:app"]
