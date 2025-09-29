import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseranimationdetailsComponent } from './useranimationdetails.component';

describe('UseranimationdetailsComponent', () => {
  let component: UseranimationdetailsComponent;
  let fixture: ComponentFixture<UseranimationdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseranimationdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseranimationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
