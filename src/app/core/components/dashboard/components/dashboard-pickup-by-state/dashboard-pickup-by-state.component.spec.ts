import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPickupByStateComponent } from './dashboard-pickup-by-state.component';

describe('DashboardPickupByStateComponent', () => {
    let component: DashboardPickupByStateComponent;
    let fixture: ComponentFixture<DashboardPickupByStateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardPickupByStateComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardPickupByStateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
