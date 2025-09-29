import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionreportComponent } from './subscriptionreport.component';

describe('SubscriptionreportComponent', () => {
  let component: SubscriptionreportComponent;
  let fixture: ComponentFixture<SubscriptionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
