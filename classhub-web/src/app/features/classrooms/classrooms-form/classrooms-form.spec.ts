import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomsForm } from './classrooms-form';

describe('ClassroomsForm', () => {
  let component: ClassroomsForm;
  let fixture: ComponentFixture<ClassroomsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomsForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassroomsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
