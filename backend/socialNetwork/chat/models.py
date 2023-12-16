from django.core.exceptions import ValidationError
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.utils import timezone
from PIL import Image
from userprofile.models import User
from friends.models import Friend


class ChatId(models.Model):
    pass


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()


class PrivateChatManager(models.Manager):
    def create_chat(self, user1, user2):
        chat_id = ChatId.objects.create()
        return self.create(id=chat_id, user1=user1, user2=user2)


class PrivateChat(models.Model):
    id = models.OneToOneField(ChatId, on_delete=models.CASCADE, primary_key=True)
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user1_private_chats")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user2_private_chats")
    last_update = models.DateTimeField(auto_now_add=True)

    messages = GenericRelation(Message)

    objects = PrivateChatManager()


class GroupChatManager(models.Manager):
    def create_chat(self, name, icon=None):
        chat_id = ChatId.objects.create()
        return GroupChat.objects.create(id=chat_id, name=name, icon=icon)

    def add_to_chat(self, added_user_id: int, chat_id: int, user: User):
        added_user = User.objects.get(id=added_user_id)
        chat = self.get(id=chat_id)
        if not Friend.objects.are_friends(user1=user.id, user2=added_user_id):
            raise ValidationError("Users are not friends")
        chat.users.add(added_user)


class GroupChat(models.Model):
    id = models.OneToOneField(ChatId, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=255)
    icon = models.ImageField(blank=True, null=True)
    users = models.ManyToManyField(User)
    last_update = models.DateTimeField(default=timezone.now)

    messages = GenericRelation(Message)

    objects = GroupChatManager()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.icon:
            icon = Image.open(self.icon.path)
            icon.save(self.icon.path, quality=50, optimize=True)


class ChatNotificationManager(models.Manager):
    def remove_notification(self, user, chat_id):
        chat_notifications = self.filter(user=user, chat_id=chat_id)
        for n in chat_notifications:
            n.delete()


class ChatNotification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    chat_id = models.ForeignKey(ChatId, on_delete=models.CASCADE)
    is_seen = models.BooleanField(default=False)

    objects = ChatNotificationManager()
