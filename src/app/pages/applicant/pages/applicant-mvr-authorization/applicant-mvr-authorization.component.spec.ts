import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantMvrAuthorizationComponent } from '@pages/applicant/pages/applicant-mvr-authorization/applicant-mvr-authorization.component';

describe('ApplicantMvrAuthorizationComponent', () => {
    let component: ApplicantMvrAuthorizationComponent;
    let fixture: ComponentFixture<ApplicantMvrAuthorizationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantMvrAuthorizationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantMvrAuthorizationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
