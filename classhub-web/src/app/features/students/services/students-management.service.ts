import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  environment,
} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentsManagementService {

  private readonly http =
    inject(HttpClient);

  getAll() {

    return this.http.get(
      `${environment.apiUrl}/students/catalog`
    );
  }

  getById(id: number) {

    return this.http.get(
      `${environment.apiUrl}/students/${id}`
    );
  }

  create(data: any) {

    return this.http.post(
      `${environment.apiUrl}/students`,
      data
    );
  }

  update(
    id: number,
    data: any
  ) {

    return this.http.put(
      `${environment.apiUrl}/students/${id}`,
      data
    );
  }

  delete(id: number) {

    return this.http.delete(
      `${environment.apiUrl}/students/${id}`
    );
  }
}