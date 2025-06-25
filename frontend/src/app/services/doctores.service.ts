import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Doctor {
  doctor_id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  profesion: string;
  horarios: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class DoctoresService {
  private apiUrl = 'http://localhost:8000/api/doctores/';

  constructor(private http: HttpClient) {}

  obtenerDoctores(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }
}
