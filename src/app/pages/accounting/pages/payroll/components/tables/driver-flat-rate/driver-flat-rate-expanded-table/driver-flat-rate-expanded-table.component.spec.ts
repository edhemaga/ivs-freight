import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverFlatRateExpandedTableComponent } from './driver-flat-rate-expanded-table.component';

describe('DriverFlatRateExpandedTableComponent', () => {
  let component: DriverFlatRateExpandedTableComponent;
  let fixture: ComponentFixture<DriverFlatRateExpandedTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverFlatRateExpandedTableComponent]
    });
    fixture = TestBed.createComponent(DriverFlatRateExpandedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
