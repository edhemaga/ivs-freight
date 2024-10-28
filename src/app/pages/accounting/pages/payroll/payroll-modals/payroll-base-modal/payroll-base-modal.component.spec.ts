import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollBaseModalComponent } from './payroll-base-modal.component';

describe('PayrollBaseModalComponent', () => {
  let component: PayrollBaseModalComponent;
  let fixture: ComponentFixture<PayrollBaseModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollBaseModalComponent]
    });
    fixture = TestBed.createComponent(PayrollBaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
