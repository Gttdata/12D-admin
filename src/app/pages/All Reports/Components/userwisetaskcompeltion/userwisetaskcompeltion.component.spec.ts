import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwisetaskcompeltionComponent } from './userwisetaskcompeltion.component';

describe('UserwisetaskcompeltionComponent', () => {
  let component: UserwisetaskcompeltionComponent;
  let fixture: ComponentFixture<UserwisetaskcompeltionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserwisetaskcompeltionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserwisetaskcompeltionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
