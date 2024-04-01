import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantSphFormThankYouComponent } from './applicant-sph-form-thank-you.component';

describe('ApplicantSphFormThankYouComponent', () => {
    let component: ApplicantSphFormThankYouComponent;
    let fixture: ComponentFixture<ApplicantSphFormThankYouComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantSphFormThankYouComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantSphFormThankYouComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
