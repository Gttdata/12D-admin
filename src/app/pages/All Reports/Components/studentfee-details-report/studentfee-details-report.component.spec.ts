import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentfeeDetailsReportComponent } from './studentfee-details-report.component';

describe('StudentfeeDetailsReportComponent', () => {
  let component: StudentfeeDetailsReportComponent;
  let fixture: ComponentFixture<StudentfeeDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentfeeDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentfeeDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
