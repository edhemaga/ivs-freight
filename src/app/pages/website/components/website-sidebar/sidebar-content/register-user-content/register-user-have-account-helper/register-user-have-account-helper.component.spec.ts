import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserHaveAccountHelperComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user-have-account-helper/register-user-have-account-helper.component';

describe('RegisterUserHaveAccountHelperComponent', () => {
    let component: RegisterUserHaveAccountHelperComponent;
    let fixture: ComponentFixture<RegisterUserHaveAccountHelperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterUserHaveAccountHelperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            RegisterUserHaveAccountHelperComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
