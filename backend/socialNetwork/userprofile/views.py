from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from core.serializers import UserLinkSerializer
from core.utils import catch_unexpected_error
from .models import User
from .serializers import UserPatchSerializer, UserSerializer, OtherUserSerializer
from .utils import create_profile_serialize_ready_data


class ProfileDetails(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = OtherUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_context(self):
        return {"request": self.request}


class UserAPI(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, request):
        return User.objects.get(id=request.user.id)

    @catch_unexpected_error
    def get(self, request):
        user = self.get_object(request)
        serialized_user = UserSerializer(user, context={'request': self.request})
        return Response(serialized_user.data, status=status.HTTP_200_OK)

    @catch_unexpected_error
    def patch(self, request):
        user = self.get_object(request)
        serialize_ready_data = create_profile_serialize_ready_data(request)
        serializer = UserPatchSerializer(user, data=serialize_ready_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["GET"])
@catch_unexpected_error
def find_user(request):
    users = User.objects.filter(username__contains=request.query_params.get('search'))[:10]
    serialized_users = UserLinkSerializer(users, many=True, context={'request': request})
    return Response(serialized_users.data, status=status.HTTP_200_OK)
