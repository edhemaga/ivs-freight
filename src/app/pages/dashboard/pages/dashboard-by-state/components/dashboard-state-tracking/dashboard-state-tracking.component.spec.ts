import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStateTrackingComponent } from '@pages/dashboard/pages/dashboard-by-state/components/dashboard-state-tracking/dashboard-state-tracking.component';

describe('DashboardStateTrackingComponent', () => {
    let component: DashboardStateTrackingComponent;
    let fixture: ComponentFixture<DashboardStateTrackingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardStateTrackingComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardStateTrackingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
