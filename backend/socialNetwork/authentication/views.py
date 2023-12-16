from rest_framework import permissions, serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from core.utils import catch_unexpected_error
from .serializers import UserSignUpSerializer


class SignUp(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    @catch_unexpected_error
    def post(self, request):
        serialized_user_data = UserSignUpSerializer(data=request.data)
        if serialized_user_data.is_valid():
            user = serialized_user_data.save()
            if user:
                return Response(status=status.HTTP_201_CREATED)
        return Response({'error_message': f"User with this username or email already registered. Error: {serialized_user_data.error_messages}"}, status=status.HTTP_400_BAD_REQUEST)


class Logout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    @catch_unexpected_error
    def post(self, request):
        token = RefreshToken(request.data["refresh_token"])
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
