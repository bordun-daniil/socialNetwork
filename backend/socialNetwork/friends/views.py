from django.db.models import Q
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from core.serializers import UserLinkSerializer
from core.utils import catch_unexpected_error
from .models import Friend, FriendNotification, FriendRequest


@permission_classes((permissions.IsAuthenticated,))
@api_view(["GET"])
@catch_unexpected_error
def get_friends(request):
    friends = Friend.objects.get_friends(user=request.query_params.get("user_id", request.user))
    serializer = UserLinkSerializer(friends, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["GET"])
@catch_unexpected_error
def get_friend_requests(request):
    friend_notifications = FriendNotification.objects.filter(Q(user=request.user) & Q(is_seen=False))
    for n in friend_notifications:
        n.is_seen = True
        n.save()
    friend_requests = FriendRequest.objects.get_requests(user=request.user)
    serializer = UserLinkSerializer(friend_requests, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["GET"])
@catch_unexpected_error
def get_sent_friend_requests(request):
    friend_requests = FriendRequest.objects.sent_requests(user=request.user)
    serializer = UserLinkSerializer(friend_requests, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["GET"])
@catch_unexpected_error
def get_rejected_friend_requests(request):
    friend_requests = FriendRequest.objects.rejected_requests(user=request.user)
    serializer = UserLinkSerializer(friend_requests, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["GET"])
@catch_unexpected_error
def get_unseen_friend_request(request):
    unseen_friend_notifications_quantity = FriendNotification.objects.filter(Q(user=request.user) & Q(is_seen=False))
    serialized_chats_id = {'friend_notifications': len(unseen_friend_notifications_quantity)}
    return Response(serialized_chats_id, status=status.HTTP_200_OK)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["POST"])
@catch_unexpected_error
def add_friend(request):
    FriendRequest.objects.add_friend(from_user=request.user, to_user=request.data["to_user"])
    return Response(status=status.HTTP_201_CREATED)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["POST"])
@catch_unexpected_error
def remove_friend(request):
    Friend.objects.remove_friend(user=request.user.id, friend=request.data["friend"])
    return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["POST"])
@catch_unexpected_error
def accept_friend_request(request):
    FriendRequest.objects.get(from_user=request.data["from_user"], to_user=request.user.id).accept()
    return Response(status=status.HTTP_201_CREATED)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["POST"])
@catch_unexpected_error
def cancel_friend_request(request):
    FriendRequest.objects.get(from_user=request.user.id, to_user=request.data["to_user"]).cancel()
    return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["POST"])
@catch_unexpected_error
def reject_friend_request(request):
    FriendRequest.objects.get(from_user=request.data["from_user"], to_user=request.user.id).reject()
    return Response(status=status.HTTP_204_NO_CONTENT)
