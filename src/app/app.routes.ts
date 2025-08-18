// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Login | Demo App', loadComponent: () => import('./app').then(m => m.AppComponent) },
  { path: 'dashboard', title: 'Dashboard | Demo App', canActivate: [authGuard], loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: '**', redirectTo: 'login' }
];