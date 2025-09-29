import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasswiseTaskDetailsReportComponent } from './classwise-task-details-report.component';

describe('ClasswiseTaskDetailsReportComponent', () => {
  let component: ClasswiseTaskDetailsReportComponent;
  let fixture: ComponentFixture<ClasswiseTaskDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasswiseTaskDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasswiseTaskDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
