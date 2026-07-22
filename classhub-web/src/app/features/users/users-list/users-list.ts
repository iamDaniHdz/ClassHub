import {
  ChangeDetectorRef,
  Component,
  OnInit,
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

@Component({
  selector: 'app-users-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './users-list.html',

  styleUrl:
    './users-list.scss',
})
export class UsersListComponent
  implements OnInit
{
  private readonly usersService =
    inject(
      UsersManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  users: any[] = [];

  roles: any[] = [];

  selectedRoleId:
    number | null = null;

  loading = true;

  ngOnInit(): void {

    this.loadRoles();

    this.loadUsers();
  }

  loadRoles(): void {

    this.usersService
      .getRoles()
      .subscribe({

        next: (response: any) => {

          this.roles =
            response.data;
        },
      });
  }

  loadUsers(): void {

    this.loading = true;

    this.usersService
      .getUsers(
        this.selectedRoleId ?? undefined
      )
      .subscribe({

        next: (response: any) => {

          this.users =
            response.data;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(error);

          this.loading = false;
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
      });
  }
}