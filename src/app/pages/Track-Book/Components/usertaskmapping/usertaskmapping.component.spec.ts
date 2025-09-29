import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertaskmappingComponent } from './usertaskmapping.component';

describe('UsertaskmappingComponent', () => {
  let component: UsertaskmappingComponent;
  let fixture: ComponentFixture<UsertaskmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsertaskmappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertaskmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
