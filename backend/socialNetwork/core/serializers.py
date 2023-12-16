from rest_framework import serializers
from userprofile.models import User


class UserLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "avatar_image"]
