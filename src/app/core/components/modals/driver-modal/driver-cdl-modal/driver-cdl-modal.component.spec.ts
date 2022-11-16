/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DriverCdlModalComponent } from './driver-cdl-modal.component';

describe('DriverCdlModalComponent', () => {
    let component: DriverCdlModalComponent;
    let fixture: ComponentFixture<DriverCdlModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DriverCdlModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DriverCdlModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
