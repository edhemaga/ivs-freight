import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantSphComponent } from '@pages/applicant/pages/applicant-sph/applicant-sph.component';

describe('ApplicantSphComponent', () => {
    let component: ApplicantSphComponent;
    let fixture: ComponentFixture<ApplicantSphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantSphComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantSphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
