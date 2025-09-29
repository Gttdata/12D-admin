import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbmireportComponent } from './userbmireport.component';

describe('UserbmireportComponent', () => {
  let component: UserbmireportComponent;
  let fixture: ComponentFixture<UserbmireportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserbmireportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserbmireportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
