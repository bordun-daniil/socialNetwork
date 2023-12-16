from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/user/', include('userprofile.urls')),
    path('api/friends/', include('friends.urls')),
    path('api/followers/', include('followers.urls')),
    path('api/feed/', include('newsfeed.urls')),
    path('api/chat/', include('chat.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
