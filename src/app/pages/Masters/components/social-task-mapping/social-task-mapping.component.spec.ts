import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialTaskMappingComponent } from './social-task-mapping.component';

describe('SocialTaskMappingComponent', () => {
  let component: SocialTaskMappingComponent;
  let fixture: ComponentFixture<SocialTaskMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialTaskMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialTaskMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
