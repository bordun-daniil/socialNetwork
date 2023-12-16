from django.urls import path
from . import views

urlpatterns = [
    # GET
    path('friends_list/', views.get_friends, name='friends_list'),
    path('friend_requests/', views.get_friend_requests, name='friend_requests'),
    path('sent_friend_requests/', views.get_sent_friend_requests, name='sent_friend_requests'),
    path('rejected_friend_requests/', views.get_rejected_friend_requests, name='rejected_friend_requests'),
    path('unseen_friend_request/', views.get_unseen_friend_request, name='unseen_friend_request'),

    # POST
    path('add_friend/', views.add_friend, name='add_friend'),
    path('remove_friend/', views.remove_friend, name='remove_friend'),
    path('accept_friend_request/', views.accept_friend_request, name='accept_friend_request'),
    path('cancel_friend_request/', views.cancel_friend_request, name='cancel_friend_request'),
    path('reject_friend_request/', views.reject_friend_request, name='reject_friend_request'),
]
