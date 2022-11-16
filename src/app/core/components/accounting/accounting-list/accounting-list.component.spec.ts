import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountingListComponent } from './accounting-list.component';

describe('AccountingListComponent', () => {
  let component: AccountingListComponent;
  let fixture: ComponentFixture<AccountingListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccountingListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
