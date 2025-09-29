import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasswiseHwCompletionDetailedReportComponent } from './classwise-hw-completion-detailed-report.component';

describe('ClasswiseHwCompletionDetailedReportComponent', () => {
  let component: ClasswiseHwCompletionDetailedReportComponent;
  let fixture: ComponentFixture<ClasswiseHwCompletionDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasswiseHwCompletionDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasswiseHwCompletionDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
