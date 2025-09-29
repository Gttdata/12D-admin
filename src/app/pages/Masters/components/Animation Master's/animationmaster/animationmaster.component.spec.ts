import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationmasterComponent } from './animationmaster.component';

describe('AnimationmasterComponent', () => {
  let component: AnimationmasterComponent;
  let fixture: ComponentFixture<AnimationmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
