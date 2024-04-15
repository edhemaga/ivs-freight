import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopRatedComponent } from '@pages/dashboard/pages/dashboard-top-rated/dashboard-top-rated.component';

describe('DashboardTopDriverComponent', () => {
    let component: DashboardTopRatedComponent;
    let fixture: ComponentFixture<DashboardTopRatedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardTopRatedComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardTopRatedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
