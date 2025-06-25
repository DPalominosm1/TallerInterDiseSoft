import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService, Cita } from '../services/citas.service';
import { DoctoresService, Doctor } from '../services/doctores.service';

@Component({
  standalone: true,
  selector: 'app-calendario',
  imports: [CommonModule, RouterLink, FormsModule],
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
          <h1 class="font-weight-normal">Calendario Citas</h1>
        </div>
      </div>
    </div>

    <section class="page-section">
      <div class="container mt-5">
        <div class="d-flex justify-content-center align-items-center my-3">
          <label class="mr-2">Semana del</label>
          <input
            type="date"
            [(ngModel)]="fechaBaseStr"
            (change)="calcularSemana()"
            class="form-control"
            style="width: 250px;"
          />
        </div>
        <div class="table-responsive">
          <table class="table table-bordered" style="table-layout: fixed;">
            <thead class="thead-light">
              <tr>
                <th>Hora</th>
                <th *ngFor="let dia of dias" style="text-align: center; width: 14%">{{ dia }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let hora of horas">
                <td style="width: 80px;"><strong>{{ hora }}</strong></td>
                <td *ngFor="let dia of dias">
                  <div class="cita-cell" style="min-height: 50px; text-align: center;">
                    <div *ngFor="let cita of obtenerCitasPorDiaYHora(dia, hora)">
                      <span class="badge" [ngClass]="getClaseEstado(cita.estado)">
                        {{ cita.nombre }} {{ cita.apellido_paterno }}
                      </span>
                      <small *ngIf="getDoctorPorId(cita.doctor_id)" class="text-muted d-block mt-1">
                        Dr(a). {{ getDoctorPorId(cita.doctor_id)?.nombre }}
                        {{ getDoctorPorId(cita.doctor_id)?.apellido_paterno }}
                        ({{ getDoctorPorId(cita.doctor_id)?.profesion }})
                      </small>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <footer class="page-footer"></footer>
  `
})
export class Calendario implements OnInit {
  dias: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  horas: string[] = [];
  fechaBaseStr: string = '';
  lunesSemana: Date | null = null;
  citas: Cita[] = [];
  doctores: Doctor[] = [];

  constructor(
    private router: Router,
    private citasService: CitasService,
    private doctoresService: DoctoresService
  ) {}

  ngOnInit() {
    this.generarHoras();
    const hoy = new Date();
    this.fechaBaseStr = hoy.toISOString().split('T')[0];
    this.calcularSemana();
    this.cargarDoctores();
  }

  cerrarSesion() {
    this.router.navigate(['/']);
  }

  private generarHoras() {
    const inicio = 8 * 60;
    const fin = 20 * 60;
    const intervalo = 30;

    for (let minuto = inicio; minuto < fin; minuto += intervalo) {
      const h = Math.floor(minuto / 60).toString().padStart(2, '0');
      const m = (minuto % 60).toString().padStart(2, '0');
      this.horas.push(`${h}:${m}`);
    }
  }

  calcularSemana() {
    if (!this.fechaBaseStr) return;

    const fechaBase = new Date(this.fechaBaseStr + 'T00:00:00');
    const diaSemana = fechaBase.getDay();
    const diff = diaSemana === 0 ? 6 : diaSemana - 1;

    const lunes = new Date(fechaBase);
    lunes.setDate(fechaBase.getDate() - diff);

    this.lunesSemana = lunes;

    this.cargarCitasDeLaSemana();
  }

  cargarCitasDeLaSemana() {
    if (!this.lunesSemana) return;

    const domingo = new Date(this.lunesSemana);
    domingo.setDate(domingo.getDate() + 6);

    this.citasService.obtenerCitas().subscribe(data => {
      this.citas = data.filter(c => {
        const fechaCita = new Date(c.fecha + 'T00:00:00');
        return fechaCita >= this.lunesSemana! && fechaCita <= domingo;
      });
    });
  }

  cargarDoctores() {
    this.doctoresService.obtenerDoctores().subscribe(data => {
      this.doctores = data;
    });
  }

  obtenerCitasPorDiaYHora(dia: string, hora: string): Cita[] {
    if (!this.lunesSemana) return [];
    const indiceDia = this.dias.indexOf(dia);
    const fechaDelDia = new Date(this.lunesSemana);
    fechaDelDia.setDate(fechaDelDia.getDate() + indiceDia);

    const fechaStr = fechaDelDia.toISOString().split('T')[0];
    return this.citas.filter(c => c.fecha === fechaStr && c.hora.startsWith(hora));
  }

  getDoctorPorId(doctorId: string): Doctor | undefined {
  return this.doctores.find(doc => doc.doctor_id === doctorId);
  }

  private estaHoraEnRango(horaCheck: string, inicio: string, fin: string): boolean {
    const toMinutos = (h: string) => {
      const [hh, mm] = h.split(':').map(x => parseInt(x, 10));
      return hh * 60 + mm;
    };
    const horaMin = toMinutos(horaCheck);
    const inicioMin = toMinutos(inicio);
    const finMin = toMinutos(fin);
    return horaMin >= inicioMin && horaMin <= finMin;
  }

  getClaseEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'badge-success';
      case 'pendiente':
        return 'badge-warning';
      case 'cancelada':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }
}
