import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitymapComponent } from './activitymap.component';

describe('ActivitymapComponent', () => {
  let component: ActivitymapComponent;
  let fixture: ComponentFixture<ActivitymapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitymapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitymapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
