from django.urls import path, include
from rest_framework.routers import DefaultRouter
from citas.views import CitaViewSet
from . import views

# Router para la API de citas
router = DefaultRouter()
router.register(r'citas', CitaViewSet)

urlpatterns = [
    path('proyectos/', views.proyectos_list),  # Tu endpoint existente
    path('', include(router.urls)),            # Ruta para la API REST de Citas
    path('api/', include('pacientes.urls')),

]
