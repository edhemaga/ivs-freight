/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsInsurancepolicyComponent } from './settings-insurancepolicy.component';

describe('SettingsInsurancepolicyComponent', () => {
    let component: SettingsInsurancepolicyComponent;
    let fixture: ComponentFixture<SettingsInsurancepolicyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsInsurancepolicyComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsInsurancepolicyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
