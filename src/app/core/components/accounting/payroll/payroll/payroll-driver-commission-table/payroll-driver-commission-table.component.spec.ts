import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PayrollDriverCommissionTableComponent} from './payroll-driver-commission-table.component';

describe('PayrollDriverCommissionTableComponent', () => {
  let component: PayrollDriverCommissionTableComponent;
  let fixture: ComponentFixture<PayrollDriverCommissionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollDriverCommissionTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollDriverCommissionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
