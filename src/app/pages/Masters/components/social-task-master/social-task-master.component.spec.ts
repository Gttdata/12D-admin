import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialTaskMasterComponent } from './social-task-master.component';

describe('SocialTaskMasterComponent', () => {
  let component: SocialTaskMasterComponent;
  let fixture: ComponentFixture<SocialTaskMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialTaskMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialTaskMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
