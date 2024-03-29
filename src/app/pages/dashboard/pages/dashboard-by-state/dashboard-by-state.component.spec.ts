import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardByStateComponent } from './dashboard-by-state.component';

describe('DashboardByStateComponent', () => {
    let component: DashboardByStateComponent;
    let fixture: ComponentFixture<DashboardByStateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardByStateComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardByStateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
