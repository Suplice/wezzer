import datetime
import json
import os
import bcrypt
import jwt
from supabase import create_client, Client
from django.http import JsonResponse
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
        }
        token = jwt.encode(token_payload, os.getenv("DJANGO_SECRET_KEY"), algorithm="HS256")

        response = JsonResponse({"success": True, "message": "User registered successfully", "userId": userId})
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