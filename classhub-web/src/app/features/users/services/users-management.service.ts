import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import {
  environment,
} from '../../../../environments/environment';

import {
  SchoolContextService,
} from '../../school-context/services/school-context.service';

@Injectable({
  providedIn: 'root',
})
export class UsersManagementService {

  private readonly http =
    inject(HttpClient);

  private readonly schoolContext =
    inject(SchoolContextService);

  getUsers(
    roleId?: number
  ) {

    let params =
      new HttpParams();

    const schoolId =
      this.schoolContext.getSchoolId();

    if (schoolId) {

      params = params.set(
        'school_id',
        schoolId
      );
    }

    if (roleId) {

      params = params.set(
        'role_id',
        roleId
      );
    }

    return this.http.get(
      `${environment.apiUrl}/users`,
      {
        params,
      }
    );
  }

  getUser(id: number) {

    return this.http.get(
      `${environment.apiUrl}/users/${id}`
    );
  }

  createUser(data: any) {

    return this.http.post(
      `${environment.apiUrl}/users`,
      data
    );
  }

  updateUser(
    id: number,
    data: any
  ) {

    return this.http.put(
      `${environment.apiUrl}/users/${id}`,
      data
    );
  }

  deleteUser(id: number) {

    return this.http.delete(
      `${environment.apiUrl}/users/${id}`
    );
  }

  getRoles() {

    return this.http.get(
      `${environment.apiUrl}/roles`
    );
  }

  getSchools() {

    return this.http.get(
      `${environment.apiUrl}/schools`
    );
  }

  assignSchool(
    userId: number,
    schoolId: number
  ) {

    return this.http.post(
      `${environment.apiUrl}/users/${userId}/schools`,
      {
        school_id: schoolId,
      }
    );
  }
}
