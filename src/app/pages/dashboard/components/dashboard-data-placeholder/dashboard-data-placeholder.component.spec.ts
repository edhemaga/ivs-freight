import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDataPlaceholderComponent } from '@pages/dashboard/components/dashboard-data-placeholder/dashboard-data-placeholder.component';

describe('DashboardDataPlaceholderComponent', () => {
    let component: DashboardDataPlaceholderComponent;
    let fixture: ComponentFixture<DashboardDataPlaceholderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardDataPlaceholderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardDataPlaceholderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
