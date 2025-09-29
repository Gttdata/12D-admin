import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionUserMasterComponent } from './subscription-user-master.component';

describe('SubscriptionUserMasterComponent', () => {
  let component: SubscriptionUserMasterComponent;
  let fixture: ComponentFixture<SubscriptionUserMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionUserMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionUserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
