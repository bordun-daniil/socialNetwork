from django.urls import re_path
from .consumers import FriendNotificationsConsumer

websocket_urlpatterns = [
    re_path(r'ws/friend_notifications/', FriendNotificationsConsumer.as_asgi())
]
