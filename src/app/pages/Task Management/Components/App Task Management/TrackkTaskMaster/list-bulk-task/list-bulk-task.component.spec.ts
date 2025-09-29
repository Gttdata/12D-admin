import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBulkTaskComponent } from './list-bulk-task.component';

describe('ListBulkTaskComponent', () => {
  let component: ListBulkTaskComponent;
  let fixture: ComponentFixture<ListBulkTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBulkTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBulkTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
