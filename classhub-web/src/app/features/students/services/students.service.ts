import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {

  private readonly http =
    inject(HttpClient);

  getById(
    studentAssignmentId: number
  ) {

    return this.http.get(
      `${environment.apiUrl}/student-assignments/${studentAssignmentId}`
    );
  }
}