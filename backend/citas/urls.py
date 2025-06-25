from django.urls import path
from .views import CitasView, CitaDetailView, ConsultasPorPacienteAPIView

urlpatterns = [
    path('', CitasView.as_view()),
    path('<int:paciente_id>/', CitaDetailView.as_view()),
    path('paciente/<int:paciente_id>/', ConsultasPorPacienteAPIView.as_view()),
]
