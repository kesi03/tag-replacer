# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Python file and README into the container
COPY tag-replacer.py .
COPY README.md .

# Keep the container alive by running a shell interactively
CMD ["tail", "-f", "/dev/null"]