import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsubjectComponent } from './questionsubject.component';

describe('QuestionsubjectComponent', () => {
  let component: QuestionsubjectComponent;
  let fixture: ComponentFixture<QuestionsubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
