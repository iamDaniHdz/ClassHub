import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AcademiesService {

  private readonly http =
    inject(HttpClient);

    getAcademies() {
      return this.http.get(
        `${environment.apiUrl}/my-academies-cards`
      );
    }

}