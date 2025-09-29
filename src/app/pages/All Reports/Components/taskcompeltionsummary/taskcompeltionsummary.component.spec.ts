import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskcompeltionsummaryComponent } from './taskcompeltionsummary.component';

describe('TaskcompeltionsummaryComponent', () => {
  let component: TaskcompeltionsummaryComponent;
  let fixture: ComponentFixture<TaskcompeltionsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskcompeltionsummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskcompeltionsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
