import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomcreatedsummaryreportsComponent } from './customcreatedsummaryreports.component';

describe('CustomcreatedsummaryreportsComponent', () => {
  let component: CustomcreatedsummaryreportsComponent;
  let fixture: ComponentFixture<CustomcreatedsummaryreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomcreatedsummaryreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomcreatedsummaryreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
