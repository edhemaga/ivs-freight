import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationUserCompanyComponent } from '@core/components/navigation/components/navigation-user-company/navigation-user-company.component';

describe('NavigationUserCompanyComponent', () => {
    let component: NavigationUserCompanyComponent;
    let fixture: ComponentFixture<NavigationUserCompanyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavigationUserCompanyComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationUserCompanyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
