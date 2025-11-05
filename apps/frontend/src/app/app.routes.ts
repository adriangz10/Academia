import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'my-loans', loadComponent: () => import('./pages/my-loans/my-loans.component').then(m => m.MyLoansComponent), canActivate: [authGuard] },
];
