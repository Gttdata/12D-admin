import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListschoolmasterComponent } from './listschoolmaster.component';

describe('ListschoolmasterComponent', () => {
  let component: ListschoolmasterComponent;
  let fixture: ComponentFixture<ListschoolmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListschoolmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListschoolmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
