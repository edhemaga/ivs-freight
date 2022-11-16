/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsBasicModalComponent } from './settings-basic-modal.component';

describe('SettingsBasicModalComponent', () => {
    let component: SettingsBasicModalComponent;
    let fixture: ComponentFixture<SettingsBasicModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsBasicModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsBasicModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
