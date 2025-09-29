import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionmasterComponent } from './dimensionmaster.component';

describe('DimensionmasterComponent', () => {
  let component: DimensionmasterComponent;
  let fixture: ComponentFixture<DimensionmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimensionmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
