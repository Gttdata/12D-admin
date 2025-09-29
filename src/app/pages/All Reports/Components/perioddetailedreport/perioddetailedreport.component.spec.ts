import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerioddetailedreportComponent } from './perioddetailedreport.component';

describe('PerioddetailedreportComponent', () => {
  let component: PerioddetailedreportComponent;
  let fixture: ComponentFixture<PerioddetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerioddetailedreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerioddetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
