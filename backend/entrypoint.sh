#!/usr/bin/env sh

python socialNetwork/manage.py collectstatic --no-input
python socialNetwork/manage.py makemigrations --no-input
python socialNetwork/manage.py migrate --no-input
uvicorn socialNetwork.asgi:application --app-dir socialNetwork --host 0.0.0.0 --port 8000 --reload --workers 3