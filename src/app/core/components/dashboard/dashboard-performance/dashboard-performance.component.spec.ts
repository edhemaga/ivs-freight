import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPerformanceComponent } from './dashboard-performance.component';

describe('DashboardPerformanceComponent', () => {
    let component: DashboardPerformanceComponent;
    let fixture: ComponentFixture<DashboardPerformanceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardPerformanceComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardPerformanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
