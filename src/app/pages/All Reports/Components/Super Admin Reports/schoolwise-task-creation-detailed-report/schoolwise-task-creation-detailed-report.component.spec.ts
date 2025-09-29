import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolwiseTaskCreationDetailedReportComponent } from './schoolwise-task-creation-detailed-report.component';

describe('SchoolwiseTaskCreationDetailedReportComponent', () => {
  let component: SchoolwiseTaskCreationDetailedReportComponent;
  let fixture: ComponentFixture<SchoolwiseTaskCreationDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolwiseTaskCreationDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolwiseTaskCreationDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
