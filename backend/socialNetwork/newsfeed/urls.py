from django.urls import path
from .views import UserPostList, PostDetail, CommentAPI, NewsfeedAPI, like_unlike_comment, like_unlike_post

urlpatterns = [
    path('', NewsfeedAPI.as_view(), name="feed"),
    path('<int:pk>/', PostDetail.as_view(), name='post_detail'),
    path('<int:pk>/comments/', CommentAPI.as_view(), name='post_comments'),
    path('user_posts/', UserPostList.as_view(), name='user_post_list'),
    path('like_unlike_post/', like_unlike_post, name='like_unlike_post'),
    path('like_unlike_comment/', like_unlike_comment, name='like_unlike_comment')
]
