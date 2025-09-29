import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackbookTasksComponent } from './trackbook-tasks.component';

describe('TrackbookTasksComponent', () => {
  let component: TrackbookTasksComponent;
  let fixture: ComponentFixture<TrackbookTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackbookTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackbookTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
