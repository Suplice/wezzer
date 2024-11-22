from supabase import create_client, Client
from django.http import JsonResponse

# Create your views here.
def get_supabase_client() -> Client:
    url = "https://nhtoemjjzmkoqaqsstxa.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odG9lbWpqem1rb3FhcXNzdHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODk4NTYsImV4cCI6MjA0Nzg2NTg1Nn0.LwW2b2iiDCYZ_X-ceKP8w6YeWEWHeXkc55LNiR4Yy58"
    return create_client(url, key)

def get_rooms(request):
    supabase = get_supabase_client()  # Ensure this function returns a valid Supabase client
    try:
        response = supabase.table("project_rooms").select("*").execute()

        return JsonResponse(response.data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)