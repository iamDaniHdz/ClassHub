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
export class AcademiesManagementService {

  private readonly http =
    inject(HttpClient);

  private readonly schoolContext =
    inject(SchoolContextService);

  private getSchoolParams(): HttpParams {

    const schoolId =
      this.schoolContext.getSchoolId();

    let params =
      new HttpParams();

    if (schoolId) {

      params = params.set(
        'school_id',
        schoolId
      );
    }

    return params;
  }

  getAll() {

    return this.http.get(
      `${environment.apiUrl}/academies`,
      {
        params:
          this.getSchoolParams(),
      }
    );
  }

  getById(id: number) {

    return this.http.get(
      `${environment.apiUrl}/academies/${id}`
    );
  }

  create(data: any) {

    const payload = {
      ...data,
      school_id:
        this.schoolContext.getSchoolId(),
    };

    return this.http.post(
      `${environment.apiUrl}/academies`,
      payload
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

  getAvailableTeachers(
    academyId: number
  ) {

    return this.http.get(
      `${environment.apiUrl}/academies/${academyId}/available-teachers`
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