import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityusesreportComponent } from './activityusesreport.component';

describe('ActivityusesreportComponent', () => {
  let component: ActivityusesreportComponent;
  let fixture: ComponentFixture<ActivityusesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityusesreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityusesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
