import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollProccessPaymentModalComponent } from './payroll-proccess-payment-modal.component';

describe('PayrollProccessPaymentModalComponent', () => {
  let component: PayrollProccessPaymentModalComponent;
  let fixture: ComponentFixture<PayrollProccessPaymentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollProccessPaymentModalComponent]
    });
    fixture = TestBed.createComponent(PayrollProccessPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
