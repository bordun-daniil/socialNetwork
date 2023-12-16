from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from PIL import Image
from userprofile.models import User


class LikeManager(models.Manager):
    use_for_related_fields = True

    def like_dislike(self, object_, user: User):
        try:
            liked_object = self.get(user=user, content_type=ContentType.objects.get_for_model(object_),
                                    object_id=object_.id)
            liked_object.delete()
        except Like.DoesNotExist:
            self.create(user=user, content_type=ContentType.objects.get_for_model(object_), object_id=object_.id)

    def is_liked(self, user_id: int) -> bool:
        return self.filter(user=user_id).exists()


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    objects = LikeManager()


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_posts', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = GenericRelation(Like)

    class Meta:
        ordering = ['-created_at']


class PostImage(models.Model):
    post = models.ForeignKey(Post, related_name='post_images', on_delete=models.CASCADE)
    image = models.ImageField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        image = Image.open(self.image.path)
        image.save(self.image.path, quality=50, optimize=True)


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    replay_to = models.ForeignKey('self', related_name='post_replies', on_delete=models.CASCADE, null=True,
                                  blank=True)
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = GenericRelation(Like)
