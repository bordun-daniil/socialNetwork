from django.urls import path
from . import views

urlpatterns = [
    # GET
    path("followers/", views.get_user_followers, name="followers"),
    path("following/", views.get_user_following, name="following"),

    # POST
    path("follow/", views.follow, name="follow"),
    path("unfollow/", views.unfollow, name="unfollow"),
]
