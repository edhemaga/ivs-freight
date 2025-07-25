/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantTrailerDetailsComponent } from '@pages/applicant/pages/applicant-owner-info/components/applicant-trailer-details/applicant-trailer-details.component';

describe('ApplicantTrailerDetailsComponent', () => {
    let component: ApplicantTrailerDetailsComponent;
    let fixture: ComponentFixture<ApplicantTrailerDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ApplicantTrailerDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantTrailerDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
