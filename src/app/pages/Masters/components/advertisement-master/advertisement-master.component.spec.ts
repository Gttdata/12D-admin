import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementMasterComponent } from './advertisement-master.component';

describe('AdvertisementMasterComponent', () => {
  let component: AdvertisementMasterComponent;
  let fixture: ComponentFixture<AdvertisementMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisementMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
