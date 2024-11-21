import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCommissionSoloTableComponent } from './driver-commission-solo-table.component';

describe('DriverCommissionSoloTableComponent', () => {
  let component: DriverCommissionSoloTableComponent;
  let fixture: ComponentFixture<DriverCommissionSoloTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverCommissionSoloTableComponent]
    });
    fixture = TestBed.createComponent(DriverCommissionSoloTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
