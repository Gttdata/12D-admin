import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappotpreportsComponent } from './whatsappotpreports.component';

describe('WhatsappotpreportsComponent', () => {
  let component: WhatsappotpreportsComponent;
  let fixture: ComponentFixture<WhatsappotpreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappotpreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappotpreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
