# Use Python 3.10.12
FROM python:3.10.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container to /app
WORKDIR /app

# Copy only the files necessary for pip install first
COPY requirements.txt ./

# Install required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files to the container
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Use an unprivileged user for running the application
RUN useradd -m appuser
USER appuser

# Define environment variables if needed
# ENV NAME World

# Check the application health
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:5000/ || exit 1

# Command to run the application
CMD ["gunicorn", "--workers=3", "--bind", "0.0.0.0:5000", "app:app"]
