import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionMasterListComponent } from './question-master-list.component';

describe('QuestionMasterListComponent', () => {
  let component: QuestionMasterListComponent;
  let fixture: ComponentFixture<QuestionMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
