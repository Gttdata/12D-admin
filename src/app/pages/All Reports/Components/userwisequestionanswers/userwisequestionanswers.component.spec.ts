import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwisequestionanswersComponent } from './userwisequestionanswers.component';

describe('UserwisequestionanswersComponent', () => {
  let component: UserwisequestionanswersComponent;
  let fixture: ComponentFixture<UserwisequestionanswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserwisequestionanswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserwisequestionanswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
