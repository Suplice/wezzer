import datetime
import json
import os
import random
import uuid
import bcrypt
import jwt
from supabase import create_client, Client
from django.http import FileResponse, HttpResponse, JsonResponse
from dotenv import load_dotenv
from django.views.decorators.csrf import csrf_exempt


load_dotenv()


def get_supabase_client() -> Client:
    url = os.getenv("DB_URL")
    key = os.getenv("DB_KEY")
    return create_client(url, key)

def get_rooms(request):
    supabase = get_supabase_client()  
    try:
        response = supabase.table("project_rooms").select("*").execute()



        return JsonResponse(response.data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
def get_rooms_with_creator(request):
    supabase = get_supabase_client()
    try:
        response = (
            supabase.table("project_rooms")
            .select("RoomId, Name, Description, backgroundImage, CreatorId, project_users!project_room_CreatorId_id_f4c815f9_fk_project_user_UserId(Nickname)")
            .execute()
        )

        rooms = response.data

        return JsonResponse(rooms, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)  
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return JsonResponse({"error": "Missing required fields"}, status=400)
        
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode("utf-8")

        supabase = get_supabase_client()

        response = supabase.auth.sign_up({"email": email, "password": password})
        if response.user is None:  
            return JsonResponse({"error": response.error.message}, status=400)

        userId = response.user.id

        supabase.table("project_users").insert([
            {"UserId": userId, "Email": email, "Password": hashed_password, "Nickname": name}
        ]).execute()

        expiration_time = datetime.datetime.now() + datetime.timedelta(days=1)
        token_payload = {
            "exp": expiration_time.timestamp(),  
            "sub": userId,
            "email": email,
            "name": name,
            "guest": False,
        }
        token = jwt.encode(token_payload, os.getenv("DJANGO_SECRET_KEY"), algorithm="HS256")

        response = JsonResponse({"success": True, "message": "Registered successfully", "userId": userId})
        response.set_cookie(
            key="authToken",  
            value=token,  
            httponly=True,  
            secure=True, 
            max_age=24 * 60 * 60,
            samesite="Strict",
        )
        return response

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
def sign_In_As_Guest(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        supabase = get_supabase_client()

        userId = uuid.uuid4()
        email = str(userId) + "@example.com"
        name = "Guest" + str(random.randint(1, 100000000))
        password = os.getenv("GUEST_PASSWORD")
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode("utf-8")

        supabase.table("project_users").insert([
            {"UserId": str(userId), "Email": email, "Password": hashed_password, "Nickname": name}
        ]).execute()

        expiration_time = datetime.datetime.now() + datetime.timedelta(hours=1)
        token_payload = {
            "exp": expiration_time.timestamp(),  
            "sub": str(userId),
            "email": email,
            "name": name,
            "guest": True,
        }
        token = jwt.encode(token_payload, os.getenv("DJANGO_SECRET_KEY"), algorithm="HS256")

        response = JsonResponse({"success": True, "message": "Successfully logged in!", "userId": str(userId), "name": name, "email": email})
        response.set_cookie(
            key="authToken",  
            value=token,  
            httponly=True,  
            secure=True, 
            max_age=60 * 60,
            samesite="Strict",
        )
        return response



    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)
@csrf_exempt
def sign_Out_As_Guest(request, user_id):

    try:
        supabase = get_supabase_client()

        supabase.table("project_users").delete().eq("UserId", user_id).execute()

        response = JsonResponse({"success": True, "message": "Successfully logged out"})
        response.delete_cookie("authToken")
        return response
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)



@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return JsonResponse({"error": "Missing required fields"}, status=400)
        
        supabase = get_supabase_client()

        response = supabase.auth.sign_in_with_password({"email" : email, "password" : password})
        if response.user is None:
            return JsonResponse({"error": response.error.message}, status=400)
        
        user = supabase.table("project_users").select("*").eq("UserId", response.user.id).execute().data[0]

        expiration_time = datetime.datetime.now() + datetime.timedelta(days=1)

        token_payload = {
            "exp": expiration_time.timestamp(),
            "sub": user["UserId"],
            "email": user["Email"],
            "name": user["Nickname"],
            "guest": False,
        }

        token = jwt.encode(token_payload, os.getenv("DJANGO_SECRET_KEY"), algorithm="HS256")

        response = JsonResponse({"success": True, "message": "Logged in successfully", "user": user})
        response.set_cookie(
            key="authToken",
            value=token,
            httponly=True,
            secure=True,
            max_age=24 * 60 * 60,
            samesite="Strict",
        )
        return response
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def check_credentials(request):
    try:
        token = request.COOKIES.get("authToken")
        if not token:
            return JsonResponse({"error": "No token provided"}, status=401)
        
        payload = jwt.decode(token, os.getenv("DJANGO_SECRET_KEY"), algorithms=["HS256"])

        is_valid = payload.get("exp") > datetime.datetime.now().timestamp()

        if not is_valid:
            response = JsonResponse({"error": "Token has expired"}, status=401)
            response.delete_cookie("authToken")
            return response

        userId = payload.get("sub")

        supabase = get_supabase_client()

        user = supabase.table("project_users").select("*").eq("UserId", userId).execute().data[0]

        newTokenPayload = {
            "exp": datetime.datetime.now() + datetime.timedelta(days=1),
            "sub": userId,
            "email": user["Email"],
            "name": user["Nickname"],
            "guest": payload.get("guest"),}

        newToken = jwt.encode(newTokenPayload, os.getenv("DJANGO_SECRET_KEY"), algorithm="HS256")

        if not user:
            return JsonResponse({"error": "User not found"}, status=404)
        
        response = JsonResponse({"success": True, "user": user, "guest": payload.get("guest")})
        response.set_cookie(
            key="authToken",
            value=newToken,
            httponly=True,
            secure=True,
            max_age=24 * 60 * 60,
            samesite="Strict",
        )

        return response
    except jwt.ExpiredSignatureError:
        response = JsonResponse({"error": "Token has expired"}, status=401)
        response.delete_cookie("authToken")
        return response
    except jwt.InvalidTokenError:
        response = JsonResponse({"error": "Invalid token"}, status=401)
        response.delete_cookie("authToken")
        return response
    except Exception as e:
        response = JsonResponse({"error": str(e)}, status=500)
        return response

@csrf_exempt
def logout_user(request):
    response = JsonResponse({"success": True, "message": "Logged out successfully"})
    response.delete_cookie("authToken")
    return response


@csrf_exempt
def create_room(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        token = request.COOKIES.get("authToken")
        if not token:
            return JsonResponse({"error": "No token provided"}, status=401)
        
        payload = jwt.decode(token, os.getenv("DJANGO_SECRET_KEY"), algorithms=["HS256"])

        is_valid = payload.get("exp") > datetime.datetime.now().timestamp()

        if not is_valid:
            response = JsonResponse({"error": "Token has expired"}, status=401)
            response.delete_cookie("authToken")
            return response

        userId = payload.get("sub")

        roomId = uuid.uuid4()

        supabase = get_supabase_client()

        user = supabase.table("project_users").select("*").eq("UserId", userId).execute().data[0]

        if not user:
            return JsonResponse({"error": "User not found"}, status=404)
        
        name = request.POST.get("roomName")
        description = request.POST.get("roomDescription")
        fileName = request.POST.get("roomBackground")

        if not name or not description:
            return JsonResponse({"error": "Missing required fields"}, status=400)
        
        response = supabase.table("project_rooms").insert([
            {"RoomId": str(roomId), "Name": name, "Description": description,"backgroundImage": fileName, "CreatorId": userId}
        ]).execute()

        file = request.FILES.get("file")

        if file:
            file_path = os.path.join(f"media/{fileName}")
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            try:
                with open(file_path, "wb") as f:
                    for chunk in file.chunks():
                        f.write(chunk)
            except Exception as e:
                return JsonResponse({"error": f"Failed to save file: {str(e)}"}, status=500)
        

           

        return JsonResponse(response.data, safe=False)
    except jwt.ExpiredSignatureError:
        response = JsonResponse({"error": "Token has expired"}, status=401)
        response.delete_cookie("authToken")
        return response
    except jwt.InvalidTokenError:
        response = JsonResponse({"error": "Invalid token"}, status=401)
        response.delete_cookie("authToken")
        return response
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_background_image(request, file_name):
    file_path = os.path.join(f"media/{file_name}")
    try:
        return FileResponse(open(file_path, "rb"), content_type="image/jpeg")
    except FileNotFoundError:
        return HttpResponse("File not found", status=404)
    
def get_background_image_with_room_id(request, room_id):
    supabase = get_supabase_client()
    response = supabase.table("project_rooms").select("backgroundImage").eq("RoomId", room_id).execute()
    file_name = response.data[0]["backgroundImage"]
    file_path = os.path.join(f"media/{file_name}")
    try:
        return FileResponse(open(file_path, "rb"), content_type="image/jpeg")
    except FileNotFoundError:
        return HttpResponse("File not found", status=404)


def get_creator_name(request, user_id):

    credentials = request.COOKIES.get("authToken")
    if not credentials:
        return JsonResponse({"error": "No token provided"}, status=401)

    try:
        supabase = get_supabase_client()
        response = supabase.table("project_users").select("Nickname").eq("UserId", user_id).execute()
        return JsonResponse(response.data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)