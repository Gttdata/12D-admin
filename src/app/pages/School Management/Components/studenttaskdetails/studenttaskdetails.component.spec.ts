import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudenttaskdetailsComponent } from './studenttaskdetails.component';

describe('StudenttaskdetailsComponent', () => {
  let component: StudenttaskdetailsComponent;
  let fixture: ComponentFixture<StudenttaskdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudenttaskdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudenttaskdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
