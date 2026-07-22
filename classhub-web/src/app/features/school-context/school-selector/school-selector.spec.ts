import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSelector } from './school-selector';

describe('SchoolSelector', () => {
  let component: SchoolSelector;
  let fixture: ComponentFixture<SchoolSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
