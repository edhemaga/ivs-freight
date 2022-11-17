import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantReviewFeedbackComponent } from './applicant-review-feedback.component';

describe('ApplicantReviewFeedbackComponent', () => {
    let component: ApplicantReviewFeedbackComponent;
    let fixture: ComponentFixture<ApplicantReviewFeedbackComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantReviewFeedbackComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantReviewFeedbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
