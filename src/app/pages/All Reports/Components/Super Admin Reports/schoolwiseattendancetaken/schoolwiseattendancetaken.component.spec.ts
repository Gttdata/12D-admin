import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolwiseattendancetakenComponent } from './schoolwiseattendancetaken.component';

describe('SchoolwiseattendancetakenComponent', () => {
  let component: SchoolwiseattendancetakenComponent;
  let fixture: ComponentFixture<SchoolwiseattendancetakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolwiseattendancetakenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolwiseattendancetakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
