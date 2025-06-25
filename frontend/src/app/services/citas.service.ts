import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cita {
  paciente_id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rut: string;
  fecha: string;
  hora: string;
  estado: string;
  doctor_id: string;

}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = 'http://127.0.0.1:8000/api/citas/';

  constructor(private http: HttpClient) {}

  obtenerCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  agregarCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  editarCita(paciente_id: string, cita: Cita): Observable<Cita> {
    const url = `${this.apiUrl}${paciente_id}/`;
    return this.http.put<Cita>(url, cita);
  }

  eliminarCita(paciente_id: string): Observable<any> {
    const url = `${this.apiUrl}${paciente_id}/`;
    return this.http.delete(url);
  }

  // Obtener todas las consultas de un paciente específico
  obtenerConsultasPorPaciente(paciente_id: string): Observable<Cita[]> {
    const url = `${this.apiUrl}paciente/${paciente_id}/`;
    return this.http.get<Cita[]>(url);
  }
}
