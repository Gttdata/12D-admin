import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseranimationcompletionComponent } from './useranimationcompletion.component';

describe('UseranimationcompletionComponent', () => {
  let component: UseranimationcompletionComponent;
  let fixture: ComponentFixture<UseranimationcompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseranimationcompletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseranimationcompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
