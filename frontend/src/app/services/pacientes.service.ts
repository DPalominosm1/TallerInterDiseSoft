import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rut: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  private apiUrl = 'http://localhost:8000/api/pacientes/';  // Ajusta URL según tu backend

  constructor(private http: HttpClient) {}

  obtenerPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }
}
