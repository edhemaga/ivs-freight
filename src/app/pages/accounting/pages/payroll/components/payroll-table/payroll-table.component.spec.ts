import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollTableComponent } from './payroll-table.component';

describe('PayrollTableComponent', () => {
  let component: PayrollTableComponent;
  let fixture: ComponentFixture<PayrollTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
