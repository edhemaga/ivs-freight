import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step7Component } from '@pages/applicant/pages/applicant-application/components/step7/step7.component';

describe('Step7Component', () => {
    let component: Step7Component;
    let fixture: ComponentFixture<Step7Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Step7Component],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Step7Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
