import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ) {

    return this.http.post<any>(
      `${this.baseUrl}/login`,
      {
        email,
        password,
      }
    )
    .pipe(

      tap(res => {

        localStorage.setItem(
          'token',
          res.data.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(
            res.data.user
          )
        );
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );
  }

  getUser() {

    const user =
      localStorage.getItem(
        'user'
      );

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  isAdmin(): boolean {

    return (
      this.getUser()
        ?.role
        ?.key
      ===
      'admin'
    );
  }

  isTeacher(): boolean {

    return (
      this.getUser()
        ?.role
        ?.key
      ===
      'teacher'
    );
  }
}