import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrearrangeactivitydetailedreportComponent } from './prearrangeactivitydetailedreport.component';

describe('PrearrangeactivitydetailedreportComponent', () => {
  let component: PrearrangeactivitydetailedreportComponent;
  let fixture: ComponentFixture<PrearrangeactivitydetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrearrangeactivitydetailedreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrearrangeactivitydetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
