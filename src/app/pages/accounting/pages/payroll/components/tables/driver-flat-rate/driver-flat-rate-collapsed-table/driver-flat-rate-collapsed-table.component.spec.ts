import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverFlatRateCollapsedTableComponent } from './driver-flat-rate-collapsed-table.component';

describe('DriverFlatRateCollapsedTableComponent', () => {
  let component: DriverFlatRateCollapsedTableComponent;
  let fixture: ComponentFixture<DriverFlatRateCollapsedTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverFlatRateCollapsedTableComponent]
    });
    fixture = TestBed.createComponent(DriverFlatRateCollapsedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
