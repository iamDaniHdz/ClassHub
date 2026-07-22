import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherProfileForm } from './teacher-profile-form';

describe('TeacherProfileForm', () => {
  let component: TeacherProfileForm;
  let fixture: ComponentFixture<TeacherProfileForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherProfileForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherProfileForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
