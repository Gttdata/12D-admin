import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ALLTaskMasterComponent } from './alltask-master.component';

describe('ALLTaskMasterComponent', () => {
  let component: ALLTaskMasterComponent;
  let fixture: ComponentFixture<ALLTaskMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ALLTaskMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ALLTaskMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
