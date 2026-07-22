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
export class DashboardOverviewService {

  private readonly http =
    inject(HttpClient);

  private readonly schoolContext =
    inject(SchoolContextService);

  getOverview() {

    const schoolId =
      this.schoolContext
        .getSchoolId();

    const params =
      new HttpParams()
        .set(
          'school_id',
          String(schoolId)
        );

    return this.http.get(
      `${environment.apiUrl}/dashboard-overview`,
      {
        params,
      }
    );
  }
}