import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionMasterComponent } from './add-question-master.component';

describe('AddQuestionMasterComponent', () => {
  let component: AddQuestionMasterComponent;
  let fixture: ComponentFixture<AddQuestionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuestionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuestionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
