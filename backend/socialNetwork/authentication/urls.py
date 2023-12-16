from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import SignUp, Logout

urlpatterns = [
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', Logout.as_view(), name='token_blacklist'),
    path('sign_up/', SignUp.as_view(), name='sign_up'),
]
