import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMileageCollapsedTableComponent } from './driver-mileage-collapsed-table.component';

describe('DriverMileageCollapsedTableComponent', () => {
  let component: DriverMileageCollapsedTableComponent;
  let fixture: ComponentFixture<DriverMileageCollapsedTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverMileageCollapsedTableComponent]
    });
    fixture = TestBed.createComponent(DriverMileageCollapsedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
