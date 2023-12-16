from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from core.serializers import UserLinkSerializer
from core.utils import catch_unexpected_error
from .models import Follow


@permission_classes((permissions.IsAuthenticated,))
@api_view(("GET",))
@catch_unexpected_error
def get_user_followers(request):
    followers = Follow.objects.get_followers(user=request.user)
    serializer = UserLinkSerializer(followers, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes((permissions.IsAuthenticated,))
@api_view(("GET",))
@catch_unexpected_error
def get_user_following(request):
    following = Follow.objects.get_following(user=request.user)
    serializer = UserLinkSerializer(following, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes((permissions.IsAuthenticated,))
@api_view(("POST",))
@catch_unexpected_error
def follow(request):
    Follow.objects.follow(following=request.data["following"], follower=request.user)
    return Response(status=status.HTTP_201_CREATED)


@permission_classes((permissions.IsAuthenticated,))
@api_view(("POST",))
@catch_unexpected_error
def unfollow(request):
    Follow.objects.remove_following(following=request.data["following"], follower=request.user.id)
    return Response(status=status.HTTP_204_NO_CONTENT)
