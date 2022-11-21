import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOwnerTableComponent } from './payroll-owner-table.component';

describe('PayrollOwnerTableComponent', () => {
  let component: PayrollOwnerTableComponent;
  let fixture: ComponentFixture<PayrollOwnerTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollOwnerTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOwnerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
