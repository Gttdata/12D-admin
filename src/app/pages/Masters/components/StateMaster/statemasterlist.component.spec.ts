import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatemasterlistComponent } from './statemasterlist.component';

describe('StatemasterlistComponent', () => {
  let component: StatemasterlistComponent;
  let fixture: ComponentFixture<StatemasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatemasterlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatemasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
