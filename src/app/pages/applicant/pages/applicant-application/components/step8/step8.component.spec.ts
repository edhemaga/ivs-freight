import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step8Component } from '@pages/applicant/pages/applicant-application/components/step8/step8.component';

describe('Step8Component', () => {
    let component: Step8Component;
    let fixture: ComponentFixture<Step8Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Step8Component],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Step8Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
