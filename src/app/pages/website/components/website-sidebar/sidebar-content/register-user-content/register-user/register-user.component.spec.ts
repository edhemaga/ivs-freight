import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user/register-user.component';

describe('RegisterUserComponent', () => {
    let component: RegisterUserComponent;
    let fixture: ComponentFixture<RegisterUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterUserComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
