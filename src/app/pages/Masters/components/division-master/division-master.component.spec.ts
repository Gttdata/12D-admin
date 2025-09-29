import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionMasterComponent } from './division-master.component';

describe('DivisionMasterComponent', () => {
  let component: DivisionMasterComponent;
  let fixture: ComponentFixture<DivisionMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DivisionMasterComponent]
    });
    fixture = TestBed.createComponent(DivisionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
