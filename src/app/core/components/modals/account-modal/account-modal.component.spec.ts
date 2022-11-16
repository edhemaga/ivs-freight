/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AccountModalComponent } from './account-modal.component';

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
