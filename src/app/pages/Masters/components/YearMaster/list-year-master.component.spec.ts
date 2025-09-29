import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYearMasterComponent } from './list-year-master.component';

describe('ListYearMasterComponent', () => {
  let component: ListYearMasterComponent;
  let fixture: ComponentFixture<ListYearMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListYearMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListYearMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
