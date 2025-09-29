import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackbookpurchasehistoryComponent } from './trackbookpurchasehistory.component';

describe('TrackbookpurchasehistoryComponent', () => {
  let component: TrackbookpurchasehistoryComponent;
  let fixture: ComponentFixture<TrackbookpurchasehistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackbookpurchasehistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackbookpurchasehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
