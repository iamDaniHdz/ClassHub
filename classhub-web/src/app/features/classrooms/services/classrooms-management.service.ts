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
export class ClassroomsManagementService {

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
      `${environment.apiUrl}/classrooms`,
      {
        params:
          this.getSchoolParams(),
      }
    );
  }

  getById(id: number) {

    return this.http.get(
      `${environment.apiUrl}/classrooms/${id}`
    );
  }

  create(data: any) {

    const payload = {
      ...data,
      school_id:
        this.schoolContext.getSchoolId(),
    };

    return this.http.post(
      `${environment.apiUrl}/classrooms`,
      payload
    );
  }

  update(
    id: number,
    data: any
  ) {

    return this.http.put(
      `${environment.apiUrl}/classrooms/${id}`,
      data
    );
  }

  delete(id: number) {

    return this.http.delete(
      `${environment.apiUrl}/classrooms/${id}`
    );
  }

  getAcademyAssignments(
    classroomId: number
  ) {

    return this.http.get(
      `${environment.apiUrl}/classrooms/${classroomId}/academy-assignments`
    );
  }

  getAcademies() {

    return this.http.get(
      `${environment.apiUrl}/academies`,
      {
        params:
          this.getSchoolParams(),
      }
    );
  }

  getAcademyTeachers(
    academyId: number,
    classroomId: number
  ) {

    return this.http.get(
      `${environment.apiUrl}/academies/${academyId}/teachers`,
      {
        params: {
          classroom_id:
            classroomId,
        },
      }
    );
  }

  assignAcademy(data: any) {

    return this.http.post(
      `${environment.apiUrl}/academy-assignments`,
      data
    );
  }

  deleteAcademyAssignment(
    assignmentId: number
  ) {

    return this.http.delete(
      `${environment.apiUrl}/academy-assignments/${assignmentId}`
    );
  }
}