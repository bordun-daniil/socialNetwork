import json
from channels.generic.websocket import AsyncWebsocketConsumer


class FriendNotificationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        self.group_name = f'frined_notifications_{user}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def friend_notification_message(self, event):
        message = event['unseen_friend_notifications_quantity']

        await self.send(text_data=json.dumps(
            message
        ))
