
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


  // TEACHER
  // Academies
  {
    path: 'academies',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['teacher'],
    },

    loadComponent: () =>
      import('./features/academies/academies-list/academies-list')
        .then(m => m.AcademiesListComponent),
  },

  {
    path: 'academies-management',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/academies-management/academies-management-list/academies-management-list'
      ).then(
        m => m.AcademiesManagementListComponent
      ),
  },

  {
    path: 'academies-management/new',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/academies-management/academy-form/academy-form'
      ).then(
        m => m.AcademyFormComponent
      ),
  },

  {
    path: 'academies-management/edit/:id',

    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/academies-management/academy-form/academy-form'
      ).then(
        m => m.AcademyFormComponent
      ),
  },

  // GROUPS

  {
    path: 'classrooms',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/classrooms/classrooms-list/classrooms-list'
      ).then(
        m => m.ClassroomsListComponent
      ),
  },

  {
    path: 'classrooms/new',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/classrooms/classrooms-form/classrooms-form'
      ).then(
        m => m.ClassroomsFormComponent
      ),
  },

  {
    path: 'classrooms/edit/:id',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/classrooms/classrooms-form/classrooms-form'
      ).then(
        m => m.ClassroomsFormComponent
      ),
  },

  {
    path: 'classrooms/:id',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/classrooms/classroom-detail/classroom-detail'
      ).then(
        m => m.ClassroomDetailComponent
      ),
  },

  {
    path: 'classrooms/:id/academies',

    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/classrooms/classroom-academies/classroom-academies'
      ).then(
        m => m.ClassroomAcademiesComponent
      ),
  },

  // TEACHERS

  {
    path: 'academies-management/:id/teachers',

    canActivate: [authGuard],

    loadComponent: () =>
      import(
        './features/academies-management/academy-teachers/academy-teachers'
      ).then(
        m => m.AcademyTeachersComponent
      ),
  },

  {
    path: 'users/:id/teacher-profile',

    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/users/teacher-profile-form/teacher-profile-form'
      ).then(
        m => m.TeacherProfileFormComponent
      ),
  },

  // STUDENTS

  {
    path: 'students',
  
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/students/students-list/students-list'
      ).then(
        m => m.StudentsListComponent
      ),
  },

  {
    path: 'students/new',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/students/student-form/student-form'
      ).then(
        m => m.StudentFormComponent
      ),
  },

  {
    path: 'students/edit/:id',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/students/student-form/student-form'
      ).then(
        m => m.StudentFormComponent
      ),
  },

  // SCHOOLS

  {
    path: 'school-selector',

    canActivate: [authGuard],

    loadComponent: () =>
      import(
        './features/school-context/school-selector/school-selector'
      ).then(
        m =>
        m.SchoolSelectorComponent
      ),
  },

  {
    path: 'schools',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/schools/schools-list/schools-list'
      ).then(
        m => m.SchoolsListComponent
      ),
  },

  {
    path: 'schools/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/schools/school-form/school-form'
      ).then(
        m => m.SchoolFormComponent
      ),
  },

  {
    path: 'schools/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/schools/school-form/school-form'
      ).then(
        m => m.SchoolFormComponent
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

  // USERS

  {
    path: 'users',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/users/users-list/users-list'
      ).then(
        m => m.UsersListComponent
      ),
  },

  {
    path: 'users/new',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/users/user-form/user-form'
      ).then(
        m => m.UserFormComponent
      ),
  },

  {
    path: 'users/edit/:id',
    
    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/users/user-form/user-form'
      ).then(
        m => m.UserFormComponent
      ),
  },  

  // SCHEDULE

  {
    path:
      'classrooms/:classroomId/academy-assignments/:assignmentId/schedules',

    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['admin'],
    },

    loadComponent: () =>
      import(
        './features/classrooms/academy-assignment-schedules/academy-assignment-schedules'
      ).then(
        m =>
          m.AcademyAssignmentSchedulesComponent
      ),
  },

  {
    path: 'my-schedule',

    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      roles: ['teacher'],
    },

    loadComponent: () =>
      import(
        './features/teachers/my-schedule/my-schedule'
      ).then(
        m => m.MyScheduleComponent
      ),
  },

  // DEFAULT
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];