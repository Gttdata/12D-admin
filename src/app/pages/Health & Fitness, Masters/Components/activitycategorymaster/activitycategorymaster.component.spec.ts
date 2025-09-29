import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitycategorymasterComponent } from './activitycategorymaster.component';

describe('ActivitycategorymasterComponent', () => {
  let component: ActivitycategorymasterComponent;
  let fixture: ComponentFixture<ActivitycategorymasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitycategorymasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitycategorymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
