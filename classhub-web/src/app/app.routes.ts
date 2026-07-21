
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

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


  // ACADEMIES
  {
    path: 'academies',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/academies/academies-list/academies-list')
        .then(m => m.AcademiesListComponent),
  },

  {
    path: 'classrooms',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/classrooms/classrooms-list/classrooms-list'
      ).then(
        m => m.ClassroomsListComponent
      ),
  },

  {
    path: 'classrooms/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/classrooms/classrooms-form/classrooms-form'
      ).then(
        m => m.ClassroomsFormComponent
      ),
  },

  {
    path: 'classrooms/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/classrooms/classrooms-form/classrooms-form'
      ).then(
        m => m.ClassroomsFormComponent
      ),
  },

  {
    path: 'classrooms/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/classrooms/classroom-detail/classroom-detail'
      ).then(
        m => m.ClassroomDetailComponent
      ),
  },

  // STUDENTS

  {
    path: 'students',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/students/students-list/students-list'
      ).then(
        m => m.StudentsListComponent
      ),
  },

  {
    path: 'students/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/students/student-form/student-form'
      ).then(
        m => m.StudentFormComponent
      ),
  },

  {
    path: 'students/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/students/student-form/student-form'
      ).then(
        m => m.StudentFormComponent
      ),
  },

  // ADMIN
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboardComponent),
  },

  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./features/admin/users/users')
        .then(m => m.UsersComponent),
  },

  // TEACHER
  {
    path: 'teacher',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['teacher'] },
    loadComponent: () =>
      import('./features/teacher/teacher-dashboard/teacher-dashboard')
        .then(m => m.TeacherDashboardComponent),
  },

  {
    path: 'teacher/classes',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['teacher'] },
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