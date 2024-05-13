import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLoadingPlaceholderComponent } from '@pages/dashboard/components/dashboard-loading-placeholder/dashboard-loading-placeholder.component';

describe('DashboardLoadingPlaceholderComponent', () => {
    let component: DashboardLoadingPlaceholderComponent;
    let fixture: ComponentFixture<DashboardLoadingPlaceholderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardLoadingPlaceholderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardLoadingPlaceholderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
