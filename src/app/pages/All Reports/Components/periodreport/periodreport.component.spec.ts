import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodreportComponent } from './periodreport.component';

describe('PeriodreportComponent', () => {
  let component: PeriodreportComponent;
  let fixture: ComponentFixture<PeriodreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
