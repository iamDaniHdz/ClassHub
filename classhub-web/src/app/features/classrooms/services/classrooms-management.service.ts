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
export class ClassroomsManagementService {

  private readonly http =
    inject(HttpClient);

  getAll() {
    return this.http.get(
      `${environment.apiUrl}/classrooms`
    );
  }

  getById(id: number) {
    return this.http.get(
      `${environment.apiUrl}/classrooms/${id}`
    );
  }

  create(data: any) {
    return this.http.post(
      `${environment.apiUrl}/classrooms`,
      data
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
      `${environment.apiUrl}/academies`
    );
  }

  getAcademyTeachers(
    academyId: number
  ) {
    return this.http.get(
      `${environment.apiUrl}/academies/${academyId}/teachers`
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