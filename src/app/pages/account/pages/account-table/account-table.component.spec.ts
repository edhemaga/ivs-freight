import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTableComponent } from '@pages/account/pages/account-table/account-table.component';

describe('AccountTableComponent', () => {
    let component: AccountTableComponent;
    let fixture: ComponentFixture<AccountTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
