import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverFlatRateTableComponent } from './driver-flat-rate-table.component';

describe('DriverFlatRateTableComponent', () => {
  let component: DriverFlatRateTableComponent;
  let fixture: ComponentFixture<DriverFlatRateTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverFlatRateTableComponent]
    });
    fixture = TestBed.createComponent(DriverFlatRateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
