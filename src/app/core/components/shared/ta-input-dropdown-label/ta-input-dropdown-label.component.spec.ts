/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaInputDropdownLabelComponent } from './ta-input-dropdown-label.component';

describe('TaInputDropdownLabelComponent', () => {
    let component: TaInputDropdownLabelComponent;
    let fixture: ComponentFixture<TaInputDropdownLabelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaInputDropdownLabelComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaInputDropdownLabelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
