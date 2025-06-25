import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CitasService, Cita } from '../services/citas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Consulta {
  fecha: string;
  motivo: string;
  diagnostico: string;
  hora: string;
}

@Component({
  standalone: true,
  selector: 'app-historial',
  imports: [RouterLink, FormsModule, CommonModule],
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
          <h1 class="font-weight-normal">Historial médico</h1>
        </div>
      </div>
    </div>

    <section class="container py-5">
      <div class="row">
        <div class="col-md-4">
          <h5 class="text-success"><strong>📁 HISTORIAL MÉDICO</strong></h5>
          <div class="input-group my-3">
            <div class="input-group-prepend"><span class="input-group-text"><i class="mai-search"></i></span></div>
            <input
              type="text"
              class="form-control"
              placeholder="Buscar Paciente"
              [(ngModel)]="searchQuery"
              (input)="filtrarPacientes()"
            />
          </div>
          <div *ngFor="let paciente of pacientesFiltrados" class="mb-2" style="cursor: pointer;" (click)="seleccionarPaciente(paciente)">
            <strong>{{ paciente.nombre }} {{ paciente.apellido_paterno }} {{ paciente.apellido_materno }}</strong><br />
            <small>RUT: {{ paciente.rut }}</small>
          </div>
        </div>

        <div class="col-md-8" *ngIf="pacienteSeleccionado">
          <div class="card">
            <div class="card-header bg-success text-white d-flex justify-content-between">
              <strong>CONSULTAS de {{ pacienteSeleccionado.nombre }} {{ pacienteSeleccionado.apellido_paterno }} {{ pacienteSeleccionado.apellido_materno }}</strong>
            </div>
            <div class="card-body" style="max-height: 300px; overflow-y: auto;">
              <table class="table table-bordered table-hover" *ngIf="consultas.length > 0; else noConsultas">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Motivo</th>
                    <th>Diagnóstico</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let consulta of consultas">
                    <td>{{ consulta.fecha }}</td>
                    <td>{{ consulta.hora }}</td>
                    <td>{{ consulta.motivo }}</td>
                    <td>{{ consulta.diagnostico }}</td>
                  </tr>
                </tbody>
              </table>
              <ng-template #noConsultas>
                <p>No hay consultas registradas para este paciente.</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="page-footer"></footer>
  `
})
export class Historial implements OnInit {
  searchQuery: string = '';
  pacientes: Cita[] = [];
  pacientesFiltrados: Cita[] = [];
  pacienteSeleccionado: Cita | null = null;
  consultas: Consulta[] = [];

  constructor(private router: Router, private citasService: CitasService) {}

  ngOnInit() {
    this.cargarPacientes();
  }

  cerrarSesion() {
    this.router.navigate(['/']);
  }

  cargarPacientes() {
    this.citasService.obtenerCitas().subscribe((data) => {
      const pacientesMap = new Map<string, Cita>();
      data.forEach((cita) => {
        if (!pacientesMap.has(cita.rut)) {
          pacientesMap.set(cita.rut, {
            paciente_id: cita.paciente_id,
            nombre: cita.nombre,
            apellido_paterno: cita.apellido_paterno,
            apellido_materno: cita.apellido_materno,
            rut: cita.rut,
            fecha: '',
            hora: '',
            estado: '',
            doctor_id: cita.doctor_id
          });
        }
      });

      this.pacientes = Array.from(pacientesMap.values());

      this.pacientes.sort((a, b) => {
        const nombreA = (a.nombre + ' ' + a.apellido_paterno + ' ' + a.apellido_materno).toLowerCase();
        const nombreB = (b.nombre + ' ' + b.apellido_paterno + ' ' + b.apellido_materno).toLowerCase();
        return nombreA.localeCompare(nombreB);
      });

      this.pacientesFiltrados = this.pacientes;
    });
  }

  filtrarPacientes() {
    const texto = this.searchQuery.toLowerCase().trim();
    if (!texto) {
      this.pacientesFiltrados = this.pacientes;
      this.pacienteSeleccionado = null;
      this.consultas = [];
      return;
    }
    this.pacientesFiltrados = this.pacientes.filter((p) =>
      (`${p.nombre} ${p.apellido_paterno} ${p.apellido_materno}`.toLowerCase().includes(texto) ||
        p.rut.toLowerCase().includes(texto))
    );

    this.pacientesFiltrados.sort((a, b) => {
      const nombreA = (a.nombre + ' ' + a.apellido_paterno + ' ' + a.apellido_materno).toLowerCase();
      const nombreB = (b.nombre + ' ' + b.apellido_paterno + ' ' + b.apellido_materno).toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
  }

  seleccionarPaciente(paciente: Cita) {
    this.pacienteSeleccionado = paciente;
    this.cargarConsultas(paciente.rut);
  }

cargarConsultas(rut: string) {
  this.citasService.obtenerCitas().subscribe((data) => {
    const consultasPaciente = data.filter(c => c.rut === rut);

    const consultasPorDoctor = new Map<string, Cita[]>();

    consultasPaciente.forEach(cita => {
      const docId = cita.doctor_id || 'desconocido';
      if (!consultasPorDoctor.has(docId)) {
        consultasPorDoctor.set(docId, []);
      }
      consultasPorDoctor.get(docId)!.push(cita);
    });

    this.consultas = [];

    consultasPorDoctor.forEach((consultas, doctorId) => {
      consultas.sort((a, b) => {
        const fechaA = new Date(a.fecha + 'T' + a.hora);
        const fechaB = new Date(b.fecha + 'T' + b.hora);
        return fechaA.getTime() - fechaB.getTime();
      });

      consultas.forEach((consulta, index) => {
        this.consultas.push({
          fecha: consulta.fecha,
          hora: consulta.hora,
          motivo: index === 0 ? 'Consulta' : 'Control',
          diagnostico: 'Pendiente',
        });
      });
    });

    // Ordenar todas las consultas finales por fecha y hora para mostrar ordenadas
    this.consultas.sort((a, b) => {
      const fechaA = new Date(a.fecha + 'T' + a.hora);
      const fechaB = new Date(b.fecha + 'T' + b.hora);
      return fechaA.getTime() - fechaB.getTime();
    });
  });
}
}