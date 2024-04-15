import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step5Component } from '@pages/applicant/pages/applicant-application/components/step5/step5.component';

describe('Step5Component', () => {
    let component: Step5Component;
    let fixture: ComponentFixture<Step5Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Step5Component],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Step5Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
