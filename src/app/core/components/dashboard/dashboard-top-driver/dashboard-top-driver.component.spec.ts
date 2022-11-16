import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopDriverComponent } from './dashboard-top-driver.component';

describe('DashboardTopDriverComponent', () => {
    let component: DashboardTopDriverComponent;
    let fixture: ComponentFixture<DashboardTopDriverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardTopDriverComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardTopDriverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
