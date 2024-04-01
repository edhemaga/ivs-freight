import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantPspAuthorizationComponent } from './applicant-psp-authorization.component';

describe('ApplicantPspAuthorizationComponent', () => {
    let component: ApplicantPspAuthorizationComponent;
    let fixture: ComponentFixture<ApplicantPspAuthorizationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantPspAuthorizationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantPspAuthorizationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
