import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step9Component } from '@pages/applicant/pages/applicant-application/components/step9/step9.component';

describe('Step9Component', () => {
    let component: Step9Component;
    let fixture: ComponentFixture<Step9Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Step9Component],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Step9Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
