import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'frontend';
  proyectos: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getProyectos().subscribe(data => {
      this.proyectos = data;
      console.log('Proyectos recibidos:', data);
    });
  }
}