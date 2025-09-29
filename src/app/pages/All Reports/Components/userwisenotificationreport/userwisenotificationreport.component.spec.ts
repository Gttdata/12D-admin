import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwisenotificationreportComponent } from './userwisenotificationreport.component';

describe('UserwisenotificationreportComponent', () => {
  let component: UserwisenotificationreportComponent;
  let fixture: ComponentFixture<UserwisenotificationreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserwisenotificationreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserwisenotificationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
