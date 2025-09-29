import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitBookComponent } from './fit-book.component';

describe('FitBookComponent', () => {
  let component: FitBookComponent;
  let fixture: ComponentFixture<FitBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FitBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FitBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
