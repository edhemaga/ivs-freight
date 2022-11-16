import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PayrollDriverTableComponent} from './payroll-driver-table.component';

describe('PayrollDriverTableComponent', () => {
  let component: PayrollDriverTableComponent;
  let fixture: ComponentFixture<PayrollDriverTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollDriverTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollDriverTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
