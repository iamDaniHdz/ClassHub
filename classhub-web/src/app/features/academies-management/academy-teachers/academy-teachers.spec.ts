import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyTeachers } from './academy-teachers';

describe('AcademyTeachers', () => {
  let component: AcademyTeachers;
  let fixture: ComponentFixture<AcademyTeachers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademyTeachers],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademyTeachers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
