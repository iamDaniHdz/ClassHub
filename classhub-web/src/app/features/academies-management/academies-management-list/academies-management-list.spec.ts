import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademiesManagementList } from './academies-management-list';

describe('AcademiesManagementList', () => {
  let component: AcademiesManagementList;
  let fixture: ComponentFixture<AcademiesManagementList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademiesManagementList],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademiesManagementList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
