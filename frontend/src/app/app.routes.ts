import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Citas } from './citas/citas';
import { Calendario } from './calendario/calendario';
import { Historial } from './historial/historial';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'citas', component: Citas },
  { path: 'calendario', component: Calendario },
  { path: 'historial', component: Historial },
];
