import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPaperClassComponent } from './question-paper-class.component';

describe('QuestionPaperClassComponent', () => {
  let component: QuestionPaperClassComponent;
  let fixture: ComponentFixture<QuestionPaperClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionPaperClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPaperClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
