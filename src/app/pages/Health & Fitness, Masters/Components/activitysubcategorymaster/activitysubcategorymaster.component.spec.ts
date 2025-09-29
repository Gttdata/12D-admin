import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitysubcategorymasterComponent } from './activitysubcategorymaster.component';

describe('ActivitysubcategorymasterComponent', () => {
  let component: ActivitysubcategorymasterComponent;
  let fixture: ComponentFixture<ActivitysubcategorymasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitysubcategorymasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitysubcategorymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
