import json
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.serializers import MessageSerializer
from .models import GroupChat, Message, PrivateChat


class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.model = PrivateChat
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.chat_group_name = 'private_chat_%s' % self.chat_id

        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name
        )

    async def prepare_message(self, message_text):
        message = await self.create_message(message_text=message_text)
        serialized_message = MessageSerializer(message)
        return serialized_message.data

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = await self.prepare_message(event['message'])

        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def create_message(self, message_text):
        model_content_type = ContentType.objects.get_for_model(self.model)

        chat = self.model.objects.get(id=self.chat_id)
        chat.last_update = timezone.now()
        chat.save()

        return Message.objects.create(
            text=message_text,
            user=self.user,
            object_id=self.chat_id,
            content_type=model_content_type
        )


class GroupChatConsumer(PrivateChatConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.model = GroupChat
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.chat_group_name = 'group_chat_%s' % self.chat_id

        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )

        await self.accept()


class ChatNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        self.group_name = f'chat_notifications_{user}'

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

    async def chat_notification_message(self, event):
        await self.send(text_data=json.dumps(
            event['chat_id']
        ))
