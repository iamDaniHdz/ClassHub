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
export class AcademyAssignmentSchedulesService {

  private readonly http =
    inject(HttpClient);

  getSchedules(
    academyAssignmentId: number
  ) {

    return this.http.get(
      `${environment.apiUrl}/academy-assignments/${academyAssignmentId}/schedules`
    );
  }

  createSchedule(
    data: any
  ) {

    return this.http.post(
      `${environment.apiUrl}/academy-assignment-schedules`,
      data
    );
  }

  deleteSchedule(
    scheduleId: number
  ) {

    return this.http.delete(
      `${environment.apiUrl}/academy-assignment-schedules/${scheduleId}`
    );
  }
}