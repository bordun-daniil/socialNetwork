from django.contrib import admin
from .models import Like, Post, PostImage, Comment

admin.site.register(Like)
admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(Comment)
