import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantLicensesTableComponent } from '@pages/applicant/components/applicant-licenses-table/applicant-licenses-table.component';

describe('ApplicantLicensesTableComponent', () => {
    let component: ApplicantLicensesTableComponent;
    let fixture: ComponentFixture<ApplicantLicensesTableComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [ApplicantLicensesTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantLicensesTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
