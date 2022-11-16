/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RepairOrderModalComponent } from './repair-order-modal.component';

describe('RepairOrderModalComponent', () => {
    let component: RepairOrderModalComponent;
    let fixture: ComponentFixture<RepairOrderModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RepairOrderModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RepairOrderModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
