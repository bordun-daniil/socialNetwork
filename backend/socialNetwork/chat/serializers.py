from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from core.serializers import UserLinkSerializer
from core.utils import stringify_created_at
from .models import PrivateChat, GroupChat, Message


class MessageSerializer(ModelSerializer):
    user = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_user(self, message: Message):
        return UserLinkSerializer(message.user, context=self.context).data

    @staticmethod
    def get_created_at(message: Message):
        return stringify_created_at(message.created_at)


class PrivateChatsListSerializer(ModelSerializer):
    companion = serializers.SerializerMethodField()

    class Meta:
        model = PrivateChat
        fields = ['id', 'companion', 'last_update']

    def get_companion(self, chat: PrivateChat):
        request = self.context['request']
        companion = chat.user1 if request.user != chat.user1 else chat.user2
        return UserLinkSerializer(companion, context=self.context).data

    def create(self, validated_data):
        return PrivateChat.objects.create_chat(**validated_data)


class PrivateChatDetailSerializer(PrivateChatsListSerializer):
    messages = serializers.SerializerMethodField()

    class Meta:
        model = PrivateChat
        fields = PrivateChatsListSerializer.Meta.fields + ['messages']

    @staticmethod
    def get_messages(chat: PrivateChat):
        return MessageSerializer(chat.messages, many=True).data


class PrivateChatCreateSerializer(ModelSerializer):
    class Meta:
        model = PrivateChat
        fields = ["user1", "user2"]

    def create(self, validated_data):
        user1 = validated_data.pop("user1")
        user2 = validated_data.pop("user2")
        try:
            return PrivateChat.objects.get(user1=user1, user2=user2)
        except PrivateChat.DoesNotExist:
            return PrivateChat.objects.create_chat(user1=user1, user2=user2)


class GroupChatsListSerializer(ModelSerializer):
    users = UserLinkSerializer(many=True)

    class Meta:
        model = GroupChat
        fields = '__all__'


class GroupChatCreateSerializer(ModelSerializer):
    class Meta:
        model = GroupChat
        fields = ['name', 'icon', 'users']

    def create(self, validated_data):
        chat = GroupChat.objects.create_chat(name=validated_data.pop("name"), icon=validated_data.pop("icon", None))
        users = validated_data.pop('users')
        for userId in users:
            chat.users.add(userId)
        return chat


class GroupChatDetailSerializer(ModelSerializer):
    users = UserLinkSerializer(many=True)
    messages = serializers.SerializerMethodField()

    class Meta:
        model = GroupChat
        fields = '__all__'

    def get_messages(self, chat: PrivateChat):
        return MessageSerializer(chat.messages, many=True, context=self.context).data
