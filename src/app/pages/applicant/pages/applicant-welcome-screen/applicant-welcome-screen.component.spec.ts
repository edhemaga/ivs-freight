import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantWelcomeScreenComponent } from './applicant-welcome-screen.component';

describe('ApplicantWelcomeScreenComponent', () => {
    let component: ApplicantWelcomeScreenComponent;
    let fixture: ComponentFixture<ApplicantWelcomeScreenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantWelcomeScreenComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantWelcomeScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
