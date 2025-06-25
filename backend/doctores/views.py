import openpyxl
from rest_framework.views import APIView
from rest_framework.response import Response
import os

EXCEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'citas', 'data', 'hospital.xlsx')

class DoctoresView(APIView):
    def get(self, request, *args, **kwargs):
        workbook = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
        sheet = workbook['doctores']  # Asegúrate de que la pestaña se llame exactamente así

        doctores = []
        for row in sheet.iter_rows(min_row=2, values_only=True):
            doctor = {
                "doctor_id": str(row[0]),
                "nombre": row[1],
                "apellido_paterno": row[2],
                "apellido_materno": row[3],
                "profesion": row[4],
                "horarios": {
                    "Lunes": row[5],
                    "Martes": row[6],
                    "Miércoles": row[7],
                    "Jueves": row[8],
                    "Viernes": row[9],
                    "Sábado": row[10]
                }
            }
            doctores.append(doctor)

        return Response(doctores)
