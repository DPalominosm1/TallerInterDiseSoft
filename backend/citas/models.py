from django.db import models

class Cita(models.Model):
    # Datos del paciente
    paciente_id = models.CharField(max_length=20, default='000000')
    nombre = models.CharField(max_length=50, default='SinNombre')
    apellido_paterno = models.CharField(max_length=50, default='SinApellido')
    apellido_materno = models.CharField(max_length=50, default='SinApellido')
    rut = models.CharField(max_length=12, default='00000000-0')
    fecha = models.DateField(default='2025-01-01')
    hora = models.TimeField(default='09:00')

    # Estado de la cita (con valor predeterminado)
    ESTADO_OPCIONES = [
        ('confirmada', 'Confirmada'),
        ('pendiente', 'Pendiente'),
        ('cancelada', 'Cancelada'),
    ]
    estado = models.CharField(max_length=20, default='pendiente')

    def __str__(self):
        return f'Cita de {self.nombre} {self.apellido_paterno} el {self.fecha} a las {self.hora}'
