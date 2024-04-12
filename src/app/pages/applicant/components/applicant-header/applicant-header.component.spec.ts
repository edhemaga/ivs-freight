import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantHeaderComponent } from '@pages/applicant/components/applicant-header/applicant-header.component';

describe('ApplicantHeaderComponent', () => {
    let component: ApplicantHeaderComponent;
    let fixture: ComponentFixture<ApplicantHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantHeaderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
