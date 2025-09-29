import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTeacherComponent } from './map-teacher.component';

describe('MapTeacherComponent', () => {
  let component: MapTeacherComponent;
  let fixture: ComponentFixture<MapTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
