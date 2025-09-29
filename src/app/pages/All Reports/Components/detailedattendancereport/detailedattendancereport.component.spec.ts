import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedattendancereportComponent } from './detailedattendancereport.component';

describe('DetailedattendancereportComponent', () => {
  let component: DetailedattendancereportComponent;
  let fixture: ComponentFixture<DetailedattendancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedattendancereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedattendancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
