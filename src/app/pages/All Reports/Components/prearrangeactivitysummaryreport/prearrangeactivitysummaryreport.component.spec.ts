import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrearrangeactivitysummaryreportComponent } from './prearrangeactivitysummaryreport.component';

describe('PrearrangeactivitysummaryreportComponent', () => {
  let component: PrearrangeactivitysummaryreportComponent;
  let fixture: ComponentFixture<PrearrangeactivitysummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrearrangeactivitysummaryreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrearrangeactivitysummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
