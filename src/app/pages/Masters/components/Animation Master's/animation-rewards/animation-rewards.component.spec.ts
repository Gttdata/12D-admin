import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationRewardsComponent } from './animation-rewards.component';

describe('AnimationRewardsComponent', () => {
  let component: AnimationRewardsComponent;
  let fixture: ComponentFixture<AnimationRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationRewardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
