import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackbookquestionmasterComponent } from './trackbookquestionmaster.component';

describe('TrackbookquestionmasterComponent', () => {
  let component: TrackbookquestionmasterComponent;
  let fixture: ComponentFixture<TrackbookquestionmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackbookquestionmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackbookquestionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
