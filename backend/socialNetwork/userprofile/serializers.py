from friends.models import FriendRequest
from rest_framework import serializers
from friends.models import Friend
from followers.models import Follow
from .models import User, UserImage


class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImage
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    user_images = UserImageSerializer(many=True)

    followers_quantity = serializers.SerializerMethodField()
    following_quantity = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "sex", "lang", "email", "bio", "avatar_image",
                  "header_image", "followers_quantity", "following_quantity", "user_images"]

    def get_followers_quantity(self, user):
        return Follow.objects.get_followers_quantity(user)

    def get_following_quantity(self, user):
        return Follow.objects.get_following_quantity(user)


class OtherUserSerializer(UserSerializer):
    is_following = serializers.SerializerMethodField()
    is_friend = serializers.SerializerMethodField()
    is_friend_request_sent = serializers.SerializerMethodField()

    def get_is_following(self, other_user: User):
        return Follow.objects.is_following(following=other_user.id, follower=self.context['request'].user.id)

    def get_is_friend(self, other_user: User):
        return Friend.objects.are_friends(self.context['request'].user.id, other_user.id)

    def get_is_friend_request_sent(self, other_user: User):
        return FriendRequest.objects.is_friend_request_sent(
            from_user=self.context['request'].user,
            to_user=other_user.id
        )

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['is_following', 'is_friend', 'is_friend_request_sent']


class UserPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'bio', 'avatar_image', 'header_image']
