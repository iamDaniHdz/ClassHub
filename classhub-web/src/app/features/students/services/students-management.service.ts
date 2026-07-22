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
export class StudentsManagementService {

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
      `${environment.apiUrl}/students/catalog`,
      {
        params:
          this.getSchoolParams(),
      }
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