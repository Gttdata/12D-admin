import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolwisemembersummeryComponent } from './schoolwisemembersummery.component';

describe('SchoolwisemembersummeryComponent', () => {
  let component: SchoolwisemembersummeryComponent;
  let fixture: ComponentFixture<SchoolwisemembersummeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolwisemembersummeryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolwisemembersummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
