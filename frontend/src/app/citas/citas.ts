import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CitasService, Cita } from '../services/citas.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-citas',
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  template: `
    <header>
      <nav class="navbar navbar-expand-lg navbar-light shadow-sm">
        <div class="container">
          <span class="navbar-brand">
            <img src="assets/img/logo-redsalud.svg" alt="Logo RedSalud" style="width: 160px;" />
          </span>
          <div class="collapse navbar-collapse" id="navbarSupport">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item"><a class="nav-link" routerLink="/citas">Citas Médicas</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/calendario">Calendario Citas</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/historial">Historial Médico</a></li>
              <li class="nav-item"><a class="btn btn-primary ml-lg-3" (click)="cerrarSesion()">Cerrar sesión</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <div class="page-banner overlay-dark bg-image" style="background-image: url(assets/img/bg_image_1.jpg)">
      <div class="banner-section">
        <div class="container text-center wow fadeInUp">
          <h1 class="font-weight-normal">Citas Médicas</h1>
        </div>
      </div>
    </div>

    <div class="container mt-5 mb-5">
      <div class="form-group">
        <label>Fecha para mostrar</label>
        <input
          type="date"
          class="form-control"
          [(ngModel)]="fechaSeleccionada"
          (ngModelChange)="filtrarCitasPorFecha()"
        />
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-striped text-center">
          <thead class="thead-light">
            <tr>
              <th></th>
              <th>ID del paciente</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>RUT</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cita of citasFiltradas">
              <td><input type="checkbox" [(ngModel)]="cita.seleccionada" (change)="onCheckChange(cita)" /></td>
              <td>{{ cita.paciente_id }}</td>
              <td>{{ cita.nombre }}</td>
              <td>{{ cita.apellido_paterno }}</td>
              <td>{{ cita.apellido_materno }}</td>
              <td>{{ cita.rut }}</td>
              <td>{{ cita.fecha }}</td>
              <td>{{ cita.hora }}</td>
              <td>{{ cita.estado }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-success mr-2" (click)="abrirModal('agregar')">Agregar</button>
        <button class="btn btn-warning mr-2" (click)="abrirModal('editar')" [disabled]="!citaSeleccionada">Editar</button>
        <button class="btn btn-danger" (click)="eliminarCitasSeleccionadas()">Eliminar</button>
      </div>
    </div>

    <div class="modal fade" tabindex="-1"
        [ngClass]="{'show': mostrarModal}"
        [ngStyle]="{display: mostrarModal ? 'block' : 'none'}"
        (click)="cerrarModal()">
      <div class="modal-dialog modal-dialog-centered" (click)="$event.stopPropagation()">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title">{{ modo === 'agregar' ? 'Agregar nueva cita' : 'Editar cita' }}</h5>
            <button type="button" class="close" (click)="cerrarModal()"><span>&times;</span></button>
          </div>
          <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
            <form (ngSubmit)="guardarCita()">
              <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="citaForm.nombre" name="nombre" required />
              </div>
              <div class="form-group">
                <label>Apellido Paterno</label>
                <input type="text" class="form-control" [(ngModel)]="citaForm.apellido_paterno" name="apellido_paterno" required />
              </div>
              <div class="form-group">
                <label>Apellido Materno</label>
                <input type="text" class="form-control" [(ngModel)]="citaForm.apellido_materno" name="apellido_materno" required />
              </div>
              <div class="form-group">
                <label>RUT</label>
                <input type="text" class="form-control" [(ngModel)]="citaForm.rut" name="rut" required />
              </div>
              <div class="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  class="form-control"
                  [(ngModel)]="citaForm.fecha"
                  name="fecha"
                  [min]="fechaHoy"
                  required
                />
              </div>
              <div class="form-group">
                <label>Hora</label>
                <select class="form-control" [(ngModel)]="citaForm.hora" name="hora" required>
                  <option *ngFor="let hora of opcionesHora" [value]="hora">{{ hora }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Estado</label>
                <select class="form-control" [(ngModel)]="citaForm.estado" name="estado" required>
                  <option>Confirmada</option>
                  <option>Pendiente</option>
                  <option>Cancelada</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success btn-block mt-3">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <footer class="page-footer"></footer>
  `
})
export class Citas implements OnInit {
  citas: (Cita & { seleccionada?: boolean })[] = [];
  citasFiltradas: (Cita & { seleccionada?: boolean })[] = [];
  mostrarModal = false;
  modo: 'agregar' | 'editar' = 'agregar';
  fechaHoy: string = '';
  fechaSeleccionada: string = '';
  opcionesHora: string[] = [];
  ultimoIdUsado: number = 0;

  citaForm: Cita = {
    paciente_id: '', 
    nombre: '', 
    apellido_paterno: '', 
    apellido_materno: '', 
    rut: '', 
    fecha: '', 
    hora: '', 
    estado: 'Pendiente',
    doctor_id: ''
  };
  citaSeleccionada: boolean = false;

  constructor(private router: Router, private citasService: CitasService) {}

  ngOnInit(): void {
    this.cargarCitas();
    this.fechaHoy = new Date().toISOString().split('T')[0];
    this.fechaSeleccionada = this.fechaHoy;
    this.generarOpcionesHora();
  }

  generarOpcionesHora() {
    const inicio = 8 * 60;
    const fin = 20 * 60;
    const intervalo = 30;

    for (let minutos = inicio; minutos < fin; minutos += intervalo) {
      const h = Math.floor(minutos / 60).toString().padStart(2, '0');
      const m = (minutos % 60).toString().padStart(2, '0');
      this.opcionesHora.push(`${h}:${m}`);
    }
  }

  cargarCitas() {
    this.citasService.obtenerCitas().subscribe(data => {
      this.citas = data;
      this.ultimoIdUsado = Math.max(...this.citas.map(c => Number(c.paciente_id)), 0);
      this.filtrarCitasPorFecha();
    });
  }

  filtrarCitasPorFecha() {
    this.citasFiltradas = this.citas.filter(cita => cita.fecha === this.fechaSeleccionada);
  }

  cerrarSesion() {
    this.router.navigate(['/']);
  }

  abrirModal(modo: 'agregar' | 'editar') {
    this.modo = modo;

    if (modo === 'editar') {
      const seleccionada = this.citas.find(c => c.seleccionada);
      if (!seleccionada) {
        alert('Selecciona una cita para editar');
        return;
      }
      this.citaForm = { ...seleccionada };
    } else {
      this.citaForm = {
        paciente_id: '', nombre: '', apellido_paterno: '', apellido_materno: '', rut: '', fecha: this.fechaSeleccionada, hora: '', estado: 'Pendiente', doctor_id: ''
      };
    }
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  obtenerDoctorId(fecha: string, hora: string): string | null {
    const tablaDoctores: any = {
      'D1': '08:00-09:30',
      'D2': '09:30-11:00',
      'D3': '11:00-12:30',
      'D4': '12:30-14:00',
      'D5': '14:00-15:30',
      'D6': '15:30-17:00',
      'D7': '17:00-18:30',
      'D8': '18:30-20:00'
    };

    for (const id in tablaDoctores) {
      const [inicio, fin] = tablaDoctores[id].split('-');
      if (hora >= inicio && hora <= fin) {
        return id;
      }
    }
    return null;
  }

  guardarCita() {
  // Validar campos obligatorios
  if (!this.citaForm.nombre.trim() ||
      !this.citaForm.apellido_paterno.trim() ||
      !this.citaForm.apellido_materno.trim() ||
      !this.citaForm.rut.trim() ||
      !this.citaForm.fecha ||
      !this.citaForm.hora ||
      !this.citaForm.estado) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Validar doctor_id según fecha y hora
  const doctorId = this.obtenerDoctorId(this.citaForm.fecha, this.citaForm.hora);
  if (!doctorId) {
    alert('No existe doctor para la fecha y hora seleccionada');
    return;
  }
  this.citaForm.doctor_id = doctorId;

  // Validación 1: No permitir repetir hora en la misma fecha para citas distintas
  const conflictoHora = this.citas.some(c =>
    c.fecha === this.citaForm.fecha &&
    c.hora === this.citaForm.hora &&
    c.paciente_id !== this.citaForm.paciente_id // excluye la misma cita al editar
  );
  if (conflictoHora) {
    alert('Ya existe una cita en esa fecha y hora.');
    return;
  }

  // Validación 2a: RUT debe estar vinculado con mismo nombre+apellidos (si existe rut, nombres deben coincidir)
  const rutInvalido = this.citas.some(c =>
    c.rut.toLowerCase() === this.citaForm.rut.toLowerCase() &&
    (
      c.nombre.toLowerCase() !== this.citaForm.nombre.toLowerCase() ||
      c.apellido_paterno.toLowerCase() !== this.citaForm.apellido_paterno.toLowerCase() ||
      c.apellido_materno.toLowerCase() !== this.citaForm.apellido_materno.toLowerCase()
    ) &&
    c.paciente_id !== this.citaForm.paciente_id
  );
  if (rutInvalido) {
    alert('El RUT ya está asociado a otro paciente con diferente nombre.');
    return;
  }

  // Validación 2b: Nombre + apellidos deben tener mismo RUT (si existe nombre, rut debe coincidir)
  const nombreInvalido = this.citas.some(c =>
    c.nombre.toLowerCase() === this.citaForm.nombre.toLowerCase() &&
    c.apellido_paterno.toLowerCase() === this.citaForm.apellido_paterno.toLowerCase() &&
    c.apellido_materno.toLowerCase() === this.citaForm.apellido_materno.toLowerCase() &&
    c.rut.toLowerCase() !== this.citaForm.rut.toLowerCase() &&
    c.paciente_id !== this.citaForm.paciente_id
  );
  if (nombreInvalido) {
    alert('El paciente con ese nombre y apellido ya tiene un RUT diferente asociado.');
    return;
  }

  // Preparar payload
  const payload = { ...this.citaForm };

  if (this.modo === 'agregar') {
    const maxId = this.citas.length > 0 ? Math.max(...this.citas.map(c => Number(c.paciente_id))) : 0;
    payload.paciente_id = (maxId + 1).toString();

    this.citasService.agregarCita(payload).subscribe(() => {
      this.cerrarModal();
      this.cargarCitas();
    });
  } else {
    this.citasService.editarCita(this.citaForm.paciente_id, payload).subscribe(() => {
      this.cerrarModal();
      this.cargarCitas();
    });
  }
}
  eliminarCitasSeleccionadas() {
    const seleccionadas = this.citas.filter(c => c.seleccionada);
    if (seleccionadas.length === 0) {
      alert('Selecciona al menos una cita para eliminar');
      return;
    }
    seleccionadas.forEach(cita => {
      this.citasService.eliminarCita(cita.paciente_id).subscribe(() => {
        this.cargarCitas();
      });
    });
  }

  onCheckChange(cita: Cita) {
    this.citas.forEach(c => {
      if (c !== cita) {
        c.seleccionada = false;
      }
    });
    this.citaSeleccionada = this.citas.some(c => c.seleccionada);
  }
}
