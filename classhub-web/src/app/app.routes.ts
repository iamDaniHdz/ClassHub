
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  // LOGIN
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent),
  },

  // DASHBOARD BASE
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.DashboardComponent),
  },

  // ADMIN
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboardComponent),
  },

  {
    path: 'admin/users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/users/users')
        .then(m => m.UsersComponent),
  },

  // TEACHER
  {
    path: 'teacher',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/teacher/teacher-dashboard/teacher-dashboard')
        .then(m => m.TeacherDashboardComponent),
  },

  {
    path: 'teacher/classes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/teacher/classes/classes')
        .then(m => m.ClassesComponent),
  },

  // DEFAULT
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }

];