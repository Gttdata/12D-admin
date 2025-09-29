import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllreporttilesComponent } from './allreporttiles.component';

describe('AllreporttilesComponent', () => {
  let component: AllreporttilesComponent;
  let fixture: ComponentFixture<AllreporttilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllreporttilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllreporttilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
