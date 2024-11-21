import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCommissionExpandedTableComponent } from './driver-commission-expanded-table.component';

describe('DriverCommissionExpandedTableComponent', () => {
  let component: DriverCommissionExpandedTableComponent;
  let fixture: ComponentFixture<DriverCommissionExpandedTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverCommissionExpandedTableComponent]
    });
    fixture = TestBed.createComponent(DriverCommissionExpandedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
