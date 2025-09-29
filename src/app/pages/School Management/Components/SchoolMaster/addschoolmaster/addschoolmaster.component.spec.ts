import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddschoolmasterComponent } from './addschoolmaster.component';

describe('AddschoolmasterComponent', () => {
  let component: AddschoolmasterComponent;
  let fixture: ComponentFixture<AddschoolmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddschoolmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddschoolmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
