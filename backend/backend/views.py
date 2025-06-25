from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import redirect

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        usuario = data.get("username")
        password = data.get("password")

        user = authenticate(username=usuario, password=password)

        if user is not None:
            return JsonResponse({"status": "ok"}, status=200)
        else:
            return JsonResponse({"status": "error", "message": "Credenciales incorrectas"}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)


def index(request):
    return redirect('/api/citas/citas/')

