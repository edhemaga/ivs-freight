import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountingTablesComponent } from './accounting-tables.component';

describe('AccountingTablesComponent', () => {
  let component: AccountingTablesComponent;
  let fixture: ComponentFixture<AccountingTablesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccountingTablesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
