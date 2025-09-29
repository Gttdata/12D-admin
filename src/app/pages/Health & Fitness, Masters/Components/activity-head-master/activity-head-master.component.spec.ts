import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityHeadMasterComponent } from './activity-head-master.component';

describe('ActivityHeadMasterComponent', () => {
  let component: ActivityHeadMasterComponent;
  let fixture: ComponentFixture<ActivityHeadMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityHeadMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHeadMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
