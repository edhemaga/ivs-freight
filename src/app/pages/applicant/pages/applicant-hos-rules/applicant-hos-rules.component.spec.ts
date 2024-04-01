import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantHosRulesComponent } from './applicant-hos-rules.component';

describe('ApplicantHosRulesComponent', () => {
    let component: ApplicantHosRulesComponent;
    let fixture: ComponentFixture<ApplicantHosRulesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantHosRulesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantHosRulesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
