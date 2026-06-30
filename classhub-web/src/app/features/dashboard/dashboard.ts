import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// Material
import { MatCardModule } from '@angular/material/card';

// Service
import { UserService } from '../../core/services/user';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [CommonModule, MatCardModule]
})
export class DashboardComponent {

  user$: Observable<any>;

  constructor(private userService: UserService) {
    this.user$ = this.userService.me();
  }
}
