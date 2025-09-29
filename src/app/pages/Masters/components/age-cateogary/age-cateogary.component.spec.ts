import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeCateogaryComponent } from './age-cateogary.component';

describe('AgeCateogaryComponent', () => {
  let component: AgeCateogaryComponent;
  let fixture: ComponentFixture<AgeCateogaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgeCateogaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeCateogaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
