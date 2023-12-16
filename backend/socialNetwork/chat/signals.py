from django.dispatch.dispatcher import receiver
from django.db.models.signals import post_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import ChatId, ChatNotification, Message
from .utils import get_notification_recipients


@receiver(post_save, sender=Message)
def send_notification(sender, instance, **kwargs):
    recipients = get_notification_recipients(instance)

    for user in recipients:
        group_name = f'chat_notifications_{user}'
        
        chat = ChatId.objects.get(id=instance.object_id)
        ChatNotification.objects.create(user=user, chat_id=chat)

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'chat_notification_message',
                'chat_id': chat.id
            }
            )
