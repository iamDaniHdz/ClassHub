import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';
import { ApiResponse } from '../../types/api';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`);
  }
}