import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantAddSaveBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-add-save-btn/applicant-add-save-btn.component';

describe('ApplicantAddSaveBtnComponent', () => {
    let component: ApplicantAddSaveBtnComponent;
    let fixture: ComponentFixture<ApplicantAddSaveBtnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantAddSaveBtnComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantAddSaveBtnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
