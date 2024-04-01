import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantMedicalCertificateComponent } from './applicant-medical-certificate.component';

describe('ApplicantMedicalCertificateComponent', () => {
    let component: ApplicantMedicalCertificateComponent;
    let fixture: ComponentFixture<ApplicantMedicalCertificateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantMedicalCertificateComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantMedicalCertificateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
