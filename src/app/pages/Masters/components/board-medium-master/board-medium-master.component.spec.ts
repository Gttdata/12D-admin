import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMediumMasterComponent } from './board-medium-master.component';

describe('BoardMediumMasterComponent', () => {
  let component: BoardMediumMasterComponent;
  let fixture: ComponentFixture<BoardMediumMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardMediumMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardMediumMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
