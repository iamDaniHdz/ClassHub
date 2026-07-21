import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyForm } from './academy-form';

describe('AcademyForm', () => {
  let component: AcademyForm;
  let fixture: ComponentFixture<AcademyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademyForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
