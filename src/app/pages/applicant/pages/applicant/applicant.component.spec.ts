import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantComponent } from '@pages/applicant/pages/applicant/applicant.component';

describe('ApplicantComponent', () => {
    let component: ApplicantComponent;
    let fixture: ComponentFixture<ApplicantComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
