from django.urls import re_path
import project.consumers as consumers

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<room_id>[^/]+)/$', consumers.RoomConsumer.as_asgi()),
]