import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMileageExpandedTableComponent } from './driver-mileage-expanded-table.component';

describe('DriverMileageExpandedTableComponent', () => {
  let component: DriverMileageExpandedTableComponent;
  let fixture: ComponentFixture<DriverMileageExpandedTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverMileageExpandedTableComponent]
    });
    fixture = TestBed.createComponent(DriverMileageExpandedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
