import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import { SchoolContextService } from '../../school-context/services/school-context.service';

@Injectable({
  providedIn: 'root',
})
export class MyPendingsService {
  private readonly http = inject(HttpClient);

  private readonly schoolContext = inject(SchoolContextService);

  getPendings() {
    const schoolId = this.schoolContext.getSchoolId();

    const params = new HttpParams().set('school_id', String(schoolId));

    return this.http.get(`${environment.apiUrl}/my-pendings`, {
      params,
    });
  }

  createPending(data: any) {
    return this.http.post(`${environment.apiUrl}/academy-assignment-pendings`, data);
  }

  updatePending(id: number, data: any) {
    return this.http.put(`${environment.apiUrl}/academy-assignment-pendings/${id}`, data);
  }

  deletePending(id: number) {
    return this.http.delete(`${environment.apiUrl}/academy-assignment-pendings/${id}`);
  }

  getPending(id: number) {
    return this.http.get(`${environment.apiUrl}/academy-assignment-pendings/${id}`);
  }

  getMyAcademyAssignments() {
    const schoolId = this.schoolContext.getSchoolId();

    const params = new HttpParams().set('school_id', String(schoolId));

    return this.http.get(`${environment.apiUrl}/my-academies-cards`, {
      params,
    });
  }
}
