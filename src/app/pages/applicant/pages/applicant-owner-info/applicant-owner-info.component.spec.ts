import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantOwnerInfoComponent } from '@pages/applicant/pages/applicant-owner-info/applicant-owner-info.component';

describe('ApplicantOwnerInfoComponent', () => {
    let component: ApplicantOwnerInfoComponent;
    let fixture: ComponentFixture<ApplicantOwnerInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantOwnerInfoComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantOwnerInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
