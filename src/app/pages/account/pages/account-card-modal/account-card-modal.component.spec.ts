import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCardModalComponent } from './account-card-modal.component';

describe('AccountCardModalComponent', () => {
  let component: AccountCardModalComponent;
  let fixture: ComponentFixture<AccountCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
