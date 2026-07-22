import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolsList } from './schools-list';

describe('SchoolsList', () => {
  let component: SchoolsList;
  let fixture: ComponentFixture<SchoolsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolsList],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
