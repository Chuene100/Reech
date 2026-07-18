# Use the official Python image as a parent image
FROM python:3.9-slim-buster

ARG DATABASE_ARG
ENV DATABASE_LINK=$DATABASE_ARG

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONPATH: $PYTHONPATH:/app/main.py:/app/db.py

EXPOSE 8080

CMD uvicorn main:app --host 0.0.0.0 --port 8080
