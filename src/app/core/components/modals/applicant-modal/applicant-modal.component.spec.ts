/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApplicantModalComponent } from './applicant-modal.component';

describe('ApplicantModalComponent', () => {
    let component: ApplicantModalComponent;
    let fixture: ComponentFixture<ApplicantModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ApplicantModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
