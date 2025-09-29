import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserrewarddetailsComponent } from './userrewarddetails.component';

describe('UserrewarddetailsComponent', () => {
  let component: UserrewarddetailsComponent;
  let fixture: ComponentFixture<UserrewarddetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserrewarddetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserrewarddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
