import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule]
})
export class Login {
  usuario = '';
  password = '';
  mensaje = '';

  constructor(private router: Router) {}

  ingresar() {
    if (this.usuario === 'admin' && this.password === '1234') {
      this.mensaje = 'Login exitoso';
      this.router.navigate(['/citas']);
    } else {
      this.mensaje = 'Usuario o contraseña incorrectos';
    }
  }
}
