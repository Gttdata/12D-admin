import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationsummaryComponent } from './animationsummary.component';

describe('AnimationsummaryComponent', () => {
  let component: AnimationsummaryComponent;
  let fixture: ComponentFixture<AnimationsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationsummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
