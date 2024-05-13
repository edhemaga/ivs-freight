import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStateUsaComponent } from '@pages/dashboard/pages/dashboard-by-state/components/dashboard-states/dashboard-state-usa/dashboard-state-usa.component';

describe('DashboardStateUsaComponent', () => {
    let component: DashboardStateUsaComponent;
    let fixture: ComponentFixture<DashboardStateUsaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardStateUsaComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardStateUsaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
