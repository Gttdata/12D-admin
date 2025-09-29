import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponcodeusagedetailedreportComponent } from './couponcodeusagedetailedreport.component';

describe('CouponcodeusagedetailedreportComponent', () => {
  let component: CouponcodeusagedetailedreportComponent;
  let fixture: ComponentFixture<CouponcodeusagedetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponcodeusagedetailedreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponcodeusagedetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
