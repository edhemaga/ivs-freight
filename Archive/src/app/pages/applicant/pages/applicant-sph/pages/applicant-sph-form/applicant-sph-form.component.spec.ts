import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantSphFormComponent } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/applicant-sph-form.component';

describe('ApplicantSphFormComponent', () => {
    let component: ApplicantSphFormComponent;
    let fixture: ComponentFixture<ApplicantSphFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantSphFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantSphFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
