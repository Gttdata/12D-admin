import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponcodeusagesummaryComponent } from './couponcodeusagesummary.component';

describe('CouponcodeusagesummaryComponent', () => {
  let component: CouponcodeusagesummaryComponent;
  let fixture: ComponentFixture<CouponcodeusagesummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponcodeusagesummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponcodeusagesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
