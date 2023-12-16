import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "socialNetwork.settings")
django_asgi_app = get_asgi_application()

from django.core.asgi import get_asgi_application
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing
import friends.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,

    "websocket": JWTAuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns +
            friends.routing.websocket_urlpatterns
        )
    ),
})