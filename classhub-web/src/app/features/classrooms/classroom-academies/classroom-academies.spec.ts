import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomAcademies } from './classroom-academies';

describe('ClassroomAcademies', () => {
  let component: ClassroomAcademies;
  let fixture: ComponentFixture<ClassroomAcademies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomAcademies],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassroomAcademies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
