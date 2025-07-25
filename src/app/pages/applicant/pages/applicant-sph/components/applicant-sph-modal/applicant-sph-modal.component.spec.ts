import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantSphModalComponent } from '@pages/applicant/pages/applicant-sph/components/applicant-sph-modal/applicant-sph-modal.component';

describe('ApplicantSphModalComponent', () => {
    let component: ApplicantSphModalComponent;
    let fixture: ComponentFixture<ApplicantSphModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantSphModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantSphModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
