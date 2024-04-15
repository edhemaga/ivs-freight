import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendConfirmationComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/resend-confirmation/resend-confirmation.component';

describe('ResendConfirmationComponent', () => {
    let component: ResendConfirmationComponent;
    let fixture: ComponentFixture<ResendConfirmationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ResendConfirmationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResendConfirmationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
