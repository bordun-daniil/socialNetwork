from django.db import models
from django.contrib.auth.models import AbstractUser
from PIL import Image
from .utils import _get_upload_path

SEX_CHOICES = [
    ("M", "Male"),
    ("F", "Female"),
    ("N", "Not indicated"),
]

LANG_CHOICES = [
    ("EN", "English"),
    ("RU", "Русский"),
]


class User(AbstractUser):
    sex = models.CharField(max_length=15, choices=SEX_CHOICES, default="N")
    lang = models.CharField(max_length=15, choices=LANG_CHOICES, default="EN")
    avatar_image = models.ImageField(upload_to=_get_upload_path, blank=True, null=True)
    header_image = models.ImageField(upload_to=_get_upload_path, blank=True, null=True)
    bio = models.TextField(max_length=3000, blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.avatar_image:
            avatar_image = Image.open(self.avatar_image.path)
            avatar_image.save(self.avatar_image.path, quality=50, optimize=True)

        if self.header_image:
            header_image = Image.open(self.header_image.path)
            header_image.save(self.header_image.path, quality=50, optimize=True)


class UserImage(models.Model):
    user = models.ForeignKey(User, related_name='user_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=_get_upload_path)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        image = Image.open(self.image.path)
        image.save(self.image.path, quality=50, optimize=True)
