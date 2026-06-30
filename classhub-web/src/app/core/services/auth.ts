import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, {
      email,
      password
    }).pipe(
      tap(res => {
        localStorage.setItem('token', res.data.token);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}