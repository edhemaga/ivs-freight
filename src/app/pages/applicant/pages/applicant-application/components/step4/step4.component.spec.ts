import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4Component } from '@pages/applicant/pages/applicant-application/components/step4/step4.component';

describe('Step4Component', () => {
    let component: Step4Component;
    let fixture: ComponentFixture<Step4Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Step4Component],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Step4Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
