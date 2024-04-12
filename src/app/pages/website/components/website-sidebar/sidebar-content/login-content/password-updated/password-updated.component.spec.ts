import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordUpdatedComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/password-updated/password-updated.component';

describe('PasswordUpdatedComponent', () => {
    let component: PasswordUpdatedComponent;
    let fixture: ComponentFixture<PasswordUpdatedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PasswordUpdatedComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordUpdatedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
