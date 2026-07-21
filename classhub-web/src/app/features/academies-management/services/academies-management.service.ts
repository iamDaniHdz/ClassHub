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

  getTeachers(
    academyId: number
  ) {

    return this.http.get(
      `${environment.apiUrl}/academies/${academyId}/teachers`
    );
  }

  getAvailableTeachers() {

    return this.http.get(
      `${environment.apiUrl}/teachers`
    );
  }

  assignTeacher(
    academyId: number,
    userId: number
  ) {

    return this.http.post(
      `${environment.apiUrl}/academy-teachers`,
      {
        academy_id: academyId,
        user_id: userId,
      }
    );
  }

  removeTeacher(
    academyId: number,
    userId: number
  ) {

    return this.http.delete(
      `${environment.apiUrl}/academies/${academyId}/teachers/${userId}`
    );
  }
}