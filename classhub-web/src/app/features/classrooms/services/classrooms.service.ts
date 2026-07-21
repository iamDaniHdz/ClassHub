import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClassroomsService {

  private readonly http =
    inject(HttpClient);

  getById(id: number) {

    return this.http.get(
        `${environment.apiUrl}/classrooms/${id}?with_students=true`      
    );
  }
}
``