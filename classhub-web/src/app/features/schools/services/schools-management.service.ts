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
export class SchoolsManagementService {

  private readonly http =
    inject(HttpClient);

  getAll() {
    return this.http.get(
      `${environment.apiUrl}/schools`
    );
  }

  getById(id: number) {
    return this.http.get(
      `${environment.apiUrl}/schools/${id}`
    );
  }

  create(data: any) {
    return this.http.post(
      `${environment.apiUrl}/schools`,
      data
    );
  }

  update(
    id: number,
    data: any
  ) {
    return this.http.put(
      `${environment.apiUrl}/schools/${id}`,
      data
    );
  }

  delete(id: number) {
    return this.http.delete(
      `${environment.apiUrl}/schools/${id}`
    );
  }
}