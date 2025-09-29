import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastersDashboardComponent } from './masters-dashboard.component';

describe('MastersDashboardComponent', () => {
  let component: MastersDashboardComponent;
  let fixture: ComponentFixture<MastersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MastersDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MastersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
