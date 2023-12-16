from django.urls import path
from rest_framework import routers
from .views import get_unseen_chats_notifications, get_user_chats, PrivateChatViewSet, GroupChatViewSet

router = routers.DefaultRouter()
router.register(r'private_chat', PrivateChatViewSet, basename='private_chat')
router.register(r'group_chat', GroupChatViewSet, basename='group_chat')

urlpatterns = [
    path('chats/', get_user_chats, name='user_chats'),
    path('unseen_chats_notifications/', get_unseen_chats_notifications, name='unseen_chats_notifications')
] + router.urls
