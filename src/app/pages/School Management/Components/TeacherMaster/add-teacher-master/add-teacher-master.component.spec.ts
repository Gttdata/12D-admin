import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeacherMasterComponent } from './add-teacher-master.component';

describe('AddTeacherMasterComponent', () => {
  let component: AddTeacherMasterComponent;
  let fixture: ComponentFixture<AddTeacherMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTeacherMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeacherMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
