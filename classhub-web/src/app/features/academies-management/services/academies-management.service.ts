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
export class AcademiesManagementService {

  private readonly http =
    inject(HttpClient);

  getAll() {

    return this.http.get(
      `${environment.apiUrl}/academies`
    );
  }

  getById(id: number) {

    return this.http.get(
      `${environment.apiUrl}/academies/${id}`
    );
  }

  create(data: any) {

    return this.http.post(
      `${environment.apiUrl}/academies`,
      data
    );
  }

  update(
    id: number,
    data: any
  ) {

    return this.http.put(
      `${environment.apiUrl}/academies/${id}`,
      data
    );
  }

  delete(id: number) {

    return this.http.delete(
      `${environment.apiUrl}/academies/${id}`
    );
  }
}