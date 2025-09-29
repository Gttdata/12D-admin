import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwisetaskdetailedreportComponent } from './userwisetaskdetailedreport.component';

describe('UserwisetaskdetailedreportComponent', () => {
  let component: UserwisetaskdetailedreportComponent;
  let fixture: ComponentFixture<UserwisetaskdetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserwisetaskdetailedreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserwisetaskdetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
