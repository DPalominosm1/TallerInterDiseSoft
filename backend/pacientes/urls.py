from django.urls import path
from .views import PacientesAPIView

urlpatterns = [
    path('pacientes/', PacientesAPIView.as_view(), name='pacientes-list'),
]
