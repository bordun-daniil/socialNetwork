from django.db.models import Q
from django.dispatch.dispatcher import receiver
from django.db.models.signals import post_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import FriendNotification, FriendRequest


@receiver(post_save, sender=FriendRequest)
def send_notification(sender, instance, **kwargs):
    user = instance.to_user
    group_name = f'frined_notifications_{user}'

    FriendNotification.objects.create(user=user)

    unseen_notifications_quantity = FriendNotification.objects.filter(Q(user=user) & Q(is_seen=False)).count()
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'friend_notification_message',
            'unseen_friend_notifications_quantity': unseen_notifications_quantity
        }
    )
