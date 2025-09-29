import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsummaryreportComponent } from './subscriptionsummaryreport.component';

describe('SubscriptionsummaryreportComponent', () => {
  let component: SubscriptionsummaryreportComponent;
  let fixture: ComponentFixture<SubscriptionsummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionsummaryreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
