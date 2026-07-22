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
export class AcademiesService {

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

  getAcademies() {

    return this.http.get(
      `${environment.apiUrl}/my-academies-cards`,
      {
        params:
          this.getSchoolParams(),
      }
    );
  }
}