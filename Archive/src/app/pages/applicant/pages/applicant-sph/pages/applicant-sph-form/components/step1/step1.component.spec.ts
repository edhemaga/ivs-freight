import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1Component } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/components/step1/step1.component';

describe('Step1Component', () => {
    let component: Step1Component;
    let fixture: ComponentFixture<Step1Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Step1Component],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Step1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
