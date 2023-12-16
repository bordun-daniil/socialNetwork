from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/private_chat/(?P<chat_id>\w+)/$', consumers.PrivateChatConsumer.as_asgi()),
    re_path(r'ws/group_chat/(?P<chat_id>\w+)/$', consumers.GroupChatConsumer.as_asgi()),
    re_path(r'ws/chat_notifications/', consumers.ChatNotificationConsumer.as_asgi())
]
