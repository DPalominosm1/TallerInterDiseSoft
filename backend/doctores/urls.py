from django.urls import path
from .views import DoctoresView  # O como hayas llamado a la vista que devuelve doctores

urlpatterns = [
    path('', DoctoresView.as_view(), name='doctores-list'),  # /api/doctores/
]
