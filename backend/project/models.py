import uuid
from django.db import models

# Create your models here.



class Room(models.Model):
    RoomId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CreatorId = models.ForeignKey('User', on_delete=models.CASCADE)
    Name = models.CharField(max_length=100)
    Description = models.CharField(max_length=500)
    backgroundImage = models.CharField(max_length=200)

class User(models.Model):
    UserId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Email = models.EmailField(max_length=100, unique=True)
    Password = models.CharField(max_length=100)
    Nickname = models.CharField(max_length=100)
    RoomId = models.ForeignKey(Room, on_delete=models.CASCADE, null=True, blank=True)
