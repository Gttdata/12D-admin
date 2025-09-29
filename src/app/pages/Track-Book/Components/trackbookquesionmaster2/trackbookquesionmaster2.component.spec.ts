import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trackbookquesionmaster2Component } from './trackbookquesionmaster2.component';

describe('Trackbookquesionmaster2Component', () => {
  let component: Trackbookquesionmaster2Component;
  let fixture: ComponentFixture<Trackbookquesionmaster2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Trackbookquesionmaster2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trackbookquesionmaster2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
