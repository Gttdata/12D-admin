import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasswiseAttendanceReportComponent } from './classwise-attendance-report.component';

describe('ClasswiseAttendanceReportComponent', () => {
  let component: ClasswiseAttendanceReportComponent;
  let fixture: ComponentFixture<ClasswiseAttendanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasswiseAttendanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasswiseAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
