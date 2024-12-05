import json
import logging
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from project.views import get_supabase_client

logger = logging.getLogger(__name__)


# Function to update the user's room
async def update_user_room(user_id: str, room_id: str):
    supabase = get_supabase_client()

    try:


        logger.info(f"Updating user room: user_id={user_id}, room_id={room_id}")

        response = supabase.table("project_users").update(
            {"RoomId_id": room_id },
        ).eq("UserId", user_id).execute()
      
    except ValueError as e:
        logger.error(f"Invalid UUID. user_id: {user_id}, room_id: {room_id}. Error: {e}")
    except Exception as e:
        logger.error(f"Error updating user room: {e}")

  


# Function to get room participants
async def get_room_participants(room_id: str):
    supabase = get_supabase_client()

    response = supabase.table("project_users").select(
        "UserId", "Nickname"
    ).eq("RoomId_id", room_id).execute()

    print(response.data)

    return response.data


class RoomConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Get room_id from the URL
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'room_{self.room_id}'

        # Initially set user to None
        self.user = None

        await self.channel_layer.group_add(
        self.room_group_name,
        self.channel_name
    )

        # Add user info from first message (authentication)
        await self.accept()  # Accept the connection first

    async def receive(self, text_data):
        data = json.loads(text_data)

        if not self.user:
            if data.get("type") == "authenticate":
                self.user = {
                    "id": data["userId"],
                    "nickname": data["userName"]
                }

                # Update user's room
                await update_user_room(self.user['id'], self.room_id)

                # Get the updated list of participants
                result = await get_room_participants(self.room_id)

                # Broadcast the updated list to all users in the room
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "user_joined",
                        "data": self.user,
                    }
                )

                # Send the participants list to the newly connected user
                await self.send(json.dumps({
                    "type": "authenticated",
                    "message": "User authenticated successfully",
                    "data": result
                }))
            else:
                await self.send(json.dumps({"error": "Authentication failed"}))
                await self.close()
                return

        # Handle other types of messages (e.g., signaling messages)
        message_type = data.get("type")
        recipient = data.get("recipient")
        payload = data.get("payload")

        if message_type in ["offer", "answer", "ice-candidate"]:
            # Send signaling messages to all participants in the room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "signal_message",
                    "sender": self.user['id'],
                    "recipient": recipient,
                    "message_type": message_type,
                    "payload": payload,
                }
            )

    async def disconnect(self, close_code):
        if self.user:
            try:
                await update_user_room(self.user['id'], None)
            except Exception as e:
                print(f"Error removing user from room: {e}")

            # Notify others that the user has left
            result = await get_room_participants(self.room_id)

                # Broadcast the updated list to all users in the room
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        "type": "user_left",
                        "data": self.user,
                    }
                )

            # Discard the user from the group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def signal_message(self, event):
        if str(self.user['id']) == event['recipient']:
            await self.send(
                json.dumps({
                    "type": event['message_type'],
                    "sender": event['sender'],
                    "payload": event['payload'],
                })
            )

    async def user_joined(self, event):
            
        await self.send(json.dumps({
            "type": "user_joined",
            "data": event['data'],
        }))

    async def user_left(self, event):
        await self.send(json.dumps({
            "type": "user_left",
            "data": event['data'],
        }))