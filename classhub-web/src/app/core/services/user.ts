import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';
import { ApiResponse } from '../../types/api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`);
  }
}