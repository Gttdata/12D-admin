import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotedstudentComponent } from './promotedstudent.component';

describe('PromotedstudentComponent', () => {
  let component: PromotedstudentComponent;
  let fixture: ComponentFixture<PromotedstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotedstudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotedstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
