import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomcreatedworkoutsreportsComponent } from './customcreatedworkoutsreports.component';

describe('CustomcreatedworkoutsreportsComponent', () => {
  let component: CustomcreatedworkoutsreportsComponent;
  let fixture: ComponentFixture<CustomcreatedworkoutsreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomcreatedworkoutsreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomcreatedworkoutsreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
