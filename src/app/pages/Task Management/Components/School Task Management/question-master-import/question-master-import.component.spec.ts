import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionMasterImportComponent } from './question-master-import.component';

describe('QuestionMasterImportComponent', () => {
  let component: QuestionMasterImportComponent;
  let fixture: ComponentFixture<QuestionMasterImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionMasterImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionMasterImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
