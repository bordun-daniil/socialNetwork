from datetime import datetime
from functools import wraps
from django.db import transaction
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST


def stringify_created_at(created_at: datetime):
    day = created_at.day if len(str(created_at.day)) == 2 else "0" + str(created_at.day)
    month = created_at.month if len(str(created_at.month)) == 2 else "0" + str(created_at.month)
    year = created_at.year
    return f"{day}.{month}.{year}"


def create_exception_message(exception: Exception) -> dict:
    return {"error_message": str(exception)}


def catch_unexpected_error(function):
    @wraps(function)
    def wrapper(request, *args, **kwargs):
        try:
            with transaction.atomic():
                return function(request, *args, **kwargs)
        except Exception as ex:
            exception = create_exception_message(ex)
            return Response(exception, status=HTTP_400_BAD_REQUEST)

    return wrapper
