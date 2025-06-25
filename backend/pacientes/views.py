import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import openpyxl
from django.conf import settings

# Ruta al archivo Excel
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCEL_PATH = os.path.join(BASE_DIR, 'citas', 'data', 'hospital.xlsx')  # Ajusta si es necesario

class PacientesAPIView(APIView):
    def get(self, request):
        try:
            workbook = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
            sheet = workbook['pacientes']  # Nombre de la pestaña que contiene pacientes

            pacientes = []
            # Asume que fila 1 es encabezado, filas desde 2 en adelante son datos
            for row in sheet.iter_rows(min_row=2, values_only=True):
                paciente = {
                    'id': row[0],  # Ajusta índices según columnas reales
                    'nombre': row[1],
                    'apellido_paterno': row[2],
                    'apellido_materno': row[3],
                    'rut': row[4],
                    # Agrega más campos si tienes
                }
                pacientes.append(paciente)

            return Response(pacientes)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
