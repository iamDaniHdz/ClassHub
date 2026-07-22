import {
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SchoolContextService {

  private readonly STORAGE_KEY =
    'active_school';

  setSchool(
    school: any
  ): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(school)
    );
  }

  getSchool(): any | null {

    const value =
      localStorage.getItem(
        this.STORAGE_KEY
      );

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  }

  getSchoolId():
    number | null
  {
    return this.getSchool()?.id
      ?? null;
  }

  getSchoolName():
    string | null
  {
    return this.getSchool()?.name
      ?? null;
  }

  clear(): void {

    localStorage.removeItem(
      this.STORAGE_KEY
    );
  }

  hasSchool(): boolean {

    return !!this.getSchool();
  }
}