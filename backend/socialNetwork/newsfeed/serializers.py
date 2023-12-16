from rest_framework import serializers
from core.serializers import UserLinkSerializer
from core.utils import stringify_created_at
from .models import Post, PostImage, Comment


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = '__all__'


class PostCreateImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["image"]


class PostCreateSerializer(serializers.ModelSerializer):
    post_images = PostCreateImageSerializer(many=True)

    class Meta:
        model = Post
        fields = ["user", "content", "post_images"]

    def create(self, validated_data):
        post_images = validated_data.pop("post_images")
        post = Post.objects.create(**validated_data)

        for pi in post_images:
            post_image = {**pi, "post": post.id}
            serialized_image = PostImageSerializer(data=post_image)
            if serialized_image.is_valid():
                serialized_image.save()

        return post


class PostPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["user", "content"]


class PostGetSerializer(serializers.ModelSerializer):
    user = UserLinkSerializer()
    post_images = PostImageSerializer(many=True)
    likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"

    def get_likes(self, post):
        return post.likes.count()

    def get_is_liked(self, post):
        return post.likes.is_liked(self.context["request"].user.id)

    def get_created_at(self, comment: Comment):
        return stringify_created_at(comment.created_at)


class CommentGetSerializer(serializers.ModelSerializer):
    user = UserLinkSerializer()
    likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "is_liked", "user", "content", "created_at", "likes", "replay_to"]

    def get_likes(self, comment: Comment):
        return comment.likes.count()

    def get_is_liked(self, comment: Comment):
        return comment.likes.is_liked(self.context['request'].user.id)

    def get_created_at(self, comment: Comment):
        return stringify_created_at(comment.created_at)


class CommentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["user", "replay_to", "content", "post"]
