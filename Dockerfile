# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Python file into the container
COPY tag-replacer.py .

COPY README.md .

# Set the default command to start a Bash shell
CMD ["bash"]