import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasswiseFeeCollectionSummaryComponent } from './classwise-fee-collection-summary.component';

describe('ClasswiseFeeCollectionSummaryComponent', () => {
  let component: ClasswiseFeeCollectionSummaryComponent;
  let fixture: ComponentFixture<ClasswiseFeeCollectionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasswiseFeeCollectionSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasswiseFeeCollectionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
