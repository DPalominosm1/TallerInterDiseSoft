from django.http import JsonResponse

def proyectos_list(request):
    data = {
        "proyectos": [
            {"id": 1, "nombre": "Proyecto A"},
            {"id": 2, "nombre": "Proyecto B"}
        ]
    }
    return JsonResponse(data)
