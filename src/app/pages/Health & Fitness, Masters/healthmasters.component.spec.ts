import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthmastersComponent } from './healthmasters.component';

describe('HealthmastersComponent', () => {
  let component: HealthmastersComponent;
  let fixture: ComponentFixture<HealthmastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthmastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthmastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
