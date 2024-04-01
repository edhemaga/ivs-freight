import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantEndScreenComponent } from './applicant-end-screen.component';

describe('ApplicantEndScreenComponent', () => {
    let component: ApplicantEndScreenComponent;
    let fixture: ComponentFixture<ApplicantEndScreenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicantEndScreenComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicantEndScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
