import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollToolbarComponent } from './payroll-toolbar.component';

describe('PayrollToolbarComponent', () => {
  let component: PayrollToolbarComponent;
  let fixture: ComponentFixture<PayrollToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollToolbarComponent]
    });
    fixture = TestBed.createComponent(PayrollToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
