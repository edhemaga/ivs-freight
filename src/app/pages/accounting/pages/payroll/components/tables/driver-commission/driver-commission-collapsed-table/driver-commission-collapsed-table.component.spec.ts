import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCommissionCollapsedTableComponent } from './driver-commission-collapsed-table.component';

describe('DriverCommissionCollapsedTableComponent', () => {
  let component: DriverCommissionCollapsedTableComponent;
  let fixture: ComponentFixture<DriverCommissionCollapsedTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverCommissionCollapsedTableComponent]
    });
    fixture = TestBed.createComponent(DriverCommissionCollapsedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
