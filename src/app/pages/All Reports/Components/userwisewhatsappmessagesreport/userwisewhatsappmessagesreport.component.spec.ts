import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwisewhatsappmessagesreportComponent } from './userwisewhatsappmessagesreport.component';

describe('UserwisewhatsappmessagesreportComponent', () => {
  let component: UserwisewhatsappmessagesreportComponent;
  let fixture: ComponentFixture<UserwisewhatsappmessagesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserwisewhatsappmessagesreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserwisewhatsappmessagesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
