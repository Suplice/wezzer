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
            "name": user["Nickname"]}

        newToken = jwt.encode(newTokenPayload, os.getenv("DJANGO_SECRET_KEY"), algorithm="HS256")

        if not user:
            return JsonResponse({"error": "User not found"}, status=404)
        
        response = JsonResponse({"success": True, "user": user})
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

