"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from project.views import check_credentials, create_room, get_background_image, get_background_image_with_room_id, get_rooms, login_user, logout_user, register_user

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/rooms', get_rooms, name='get_rooms'),
    path('api/register', register_user, name='register_user'),
    path('api/login', login_user, name='login'),
    path('api/checkCredentials', check_credentials, name='check_credentials'),
    path('api/logout', logout_user, name='logout'),
    path('api/createRoom', create_room, name='create_room'),
    path('api/getBackgroundImage/<str:file_name>', get_background_image, name='get_background_image'),
    path('api/getBackgroundImageWithId/<str:room_id>', get_background_image_with_room_id, name='get_background_image_with_id'),
]
