import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterMasterComponent } from './chapter-master.component';

describe('ChapterMasterComponent', () => {
  let component: ChapterMasterComponent;
  let fixture: ComponentFixture<ChapterMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChapterMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
