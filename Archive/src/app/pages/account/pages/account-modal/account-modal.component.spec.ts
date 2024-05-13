/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';

describe('AccountModalComponent', () => {
    let component: AccountModalComponent;
    let fixture: ComponentFixture<AccountModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AccountModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
