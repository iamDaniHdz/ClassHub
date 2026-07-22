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
export class MyScheduleService {

  private readonly http =
    inject(HttpClient);

  private readonly schoolContext =
    inject(SchoolContextService);

  getSchedule() {

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

    return this.http.get(
      `${environment.apiUrl}/my-schedule`,
      {
        params,
      }
    );
  }
}