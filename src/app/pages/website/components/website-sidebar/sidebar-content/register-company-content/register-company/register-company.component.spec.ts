import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCompanyComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-company-content/register-company/register-company.component';

describe('RegisterCompanyComponent', () => {
    let component: RegisterCompanyComponent;
    let fixture: ComponentFixture<RegisterCompanyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterCompanyComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterCompanyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
