/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantWorkExperienceTableComponent } from '@pages/applicant/components/applicant-work-experience-table/applicant-work-experience-table/applicant-work-experience-table.component';

describe('ApplicantWorkExperienceTableComponent', () => {
    let component: ApplicantWorkExperienceTableComponent;
    let fixture: ComponentFixture<ApplicantWorkExperienceTableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ApplicantWorkExperienceTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(
            ApplicantWorkExperienceTableComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
