import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerMasterComponent } from './banner-master.component';

describe('BannerMasterComponent', () => {
  let component: BannerMasterComponent;
  let fixture: ComponentFixture<BannerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
