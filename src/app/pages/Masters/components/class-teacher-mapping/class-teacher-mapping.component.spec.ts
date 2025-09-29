import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassTeacherMappingComponent } from './class-teacher-mapping.component';

describe('ClassTeacherMappingComponent', () => {
  let component: ClassTeacherMappingComponent;
  let fixture: ComponentFixture<ClassTeacherMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassTeacherMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassTeacherMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
