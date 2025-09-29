import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackBookComponent } from './track-Book.component';


describe('TrackBookComponent', () => {
  let component: TrackBookComponent;
  let fixture: ComponentFixture<TrackBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
