/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsFactoringModalComponent } from './settings-factoring-modal.component';

describe('SettingsFactoringModalComponent', () => {
    let component: SettingsFactoringModalComponent;
    let fixture: ComponentFixture<SettingsFactoringModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsFactoringModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsFactoringModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
