import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMasterNewComponent } from './subscription-master-new.component';

describe('SubscriptionMasterNewComponent', () => {
  let component: SubscriptionMasterNewComponent;
  let fixture: ComponentFixture<SubscriptionMasterNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionMasterNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionMasterNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
