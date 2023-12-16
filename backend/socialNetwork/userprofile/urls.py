from django.urls import path
from .views import UserAPI, ProfileDetails, find_user

urlpatterns = [
    path('', UserAPI.as_view()),
    path('<int:pk>/', ProfileDetails.as_view()),
    path('find_user/', find_user)
]
