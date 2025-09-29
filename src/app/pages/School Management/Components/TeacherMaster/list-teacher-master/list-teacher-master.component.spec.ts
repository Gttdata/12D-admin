import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTeacherMasterComponent } from './list-teacher-master.component';

describe('ListTeacherMasterComponent', () => {
  let component: ListTeacherMasterComponent;
  let fixture: ComponentFixture<ListTeacherMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTeacherMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTeacherMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
