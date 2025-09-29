import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwisemailreportComponent } from './userwisemailreport.component';

describe('UserwisemailreportComponent', () => {
  let component: UserwisemailreportComponent;
  let fixture: ComponentFixture<UserwisemailreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserwisemailreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserwisemailreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
