import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get<any>(`${this.baseUrl}/me`);
  }
}