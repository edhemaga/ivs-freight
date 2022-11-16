import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollEmployeTableComponent } from './payroll-employe-table.component';

describe('PayrollEmployeTableComponent', () => {
  let component: PayrollEmployeTableComponent;
  let fixture: ComponentFixture<PayrollEmployeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollEmployeTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollEmployeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
