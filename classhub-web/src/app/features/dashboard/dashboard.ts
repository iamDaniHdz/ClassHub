import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';

// Service
import { UserService } from '../../core/services/user';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class DashboardComponent implements OnInit {

  user: any = null;
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;

    this.userService.me().subscribe({
      next: (res) => {
        console.log('RESPONSE:', res);

        this.user = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);

        this.error = 'No se pudo obtener el usuario';
        this.loading = false;
      }
    });
  }
}