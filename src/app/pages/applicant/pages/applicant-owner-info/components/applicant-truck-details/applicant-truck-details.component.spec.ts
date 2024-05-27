/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantTruckDetailsComponent } from './applicant-truck-details.component';

describe('ApplicantTruckDetailsComponent', () => {
    let component: ApplicantTruckDetailsComponent;
    let fixture: ComponentFixture<ApplicantTruckDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ApplicantTruckDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantTruckDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
