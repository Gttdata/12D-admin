import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusreportComponent } from './contactusreport.component';

describe('ContactusreportComponent', () => {
  let component: ContactusreportComponent;
  let fixture: ComponentFixture<ContactusreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactusreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactusreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
