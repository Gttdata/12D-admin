import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDetailsReportComponent } from './teacher-details-report.component';

describe('TeacherDetailsReportComponent', () => {
  let component: TeacherDetailsReportComponent;
  let fixture: ComponentFixture<TeacherDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
