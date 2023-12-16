from django.contrib import admin
from .models import PrivateChat, GroupChat, Message, ChatId, ChatNotification

admin.site.register(PrivateChat)
admin.site.register(GroupChat)
admin.site.register(Message)
admin.site.register(ChatId)
admin.site.register(ChatNotification)
