import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertaskbookanswersComponent } from './usertaskbookanswers.component';

describe('UsertaskbookanswersComponent', () => {
  let component: UsertaskbookanswersComponent;
  let fixture: ComponentFixture<UsertaskbookanswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsertaskbookanswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertaskbookanswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
