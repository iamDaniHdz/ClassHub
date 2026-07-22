import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  RouterLink,
} from '@angular/router';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  UsersManagementService,
} from '../services/users-management.service';

import {
  DataTableComponent,
  DataTableColumn,
} from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-users-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AppHeaderComponent,
    DataTableComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './users-list.html',

  styleUrl:
    './users-list.scss',
})
export class UsersListComponent
  implements OnInit, AfterViewInit
{
  private readonly usersService =
    inject(
      UsersManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  @ViewChild(
    'schoolsTemplate'
  )
  schoolsTemplate!: TemplateRef<any>;

  @ViewChild(
    'actionsTemplate'
  )
  actionsTemplate!: TemplateRef<any>;

  users: any[] = [];

  roles: any[] = [];

  selectedRoleId:
    number | null = null;

  loading = true;

  columns: DataTableColumn[] = [];

  ngOnInit(): void {

    this.loadRoles();

    this.loadUsers();
  }

  ngAfterViewInit(): void {

    this.columns = [

      {
        key: 'name',
        header: 'Nombre',
        sortable: true,
      },

      {
        key: 'email',
        header: 'Email',
        sortable: true,
      },

      {
        key: 'role_name',
        header: 'Rol',
        sortable: true,
      },

      {
        key: 'schools',
        header: 'Escuelas',
        cellTemplate:
          this.schoolsTemplate,
      },

      {
        key: 'actions',
        header: 'Acciones',
        cellTemplate:
          this.actionsTemplate,
      },
    ];

    this.cdr.detectChanges();
  }

  loadRoles(): void {

    this.usersService
      .getRoles()
      .subscribe({

        next: (
          response: any
        ) => {

          this.roles =
            response.data;
        },
      });
  }

  loadUsers(): void {

    this.loading = true;

    this.usersService
      .getUsers(
        this.selectedRoleId ??
        undefined
      )
      .subscribe({

        next: (
          response: any
        ) => {

          this.users =
            response.data.map(
              (user: any) => ({

                ...user,

                role_name:
                  user.role?.name ??
                  '',
              })
            );

          this.loading =
            false;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(
            error
          );

          this.loading =
            false;
        },
      });
  }

  deleteUser(
    userId: number
  ): void {

    const confirmed =
      confirm(
        '¿Eliminar usuario?'
      );

    if (!confirmed) {
      return;
    }

    this.usersService
      .deleteUser(userId)
      .subscribe({

        next: () => {

          this.loadUsers();
        },

        error: error => {

          console.error(
            error
          );
        },
      });
  }
}