import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTablePreTripInspectionComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-pre-trip-inspection/dispatch-table-pre-trip-inspection.component';

describe('DispatchTablePreTripInspectionComponent', () => {
    let component: DispatchTablePreTripInspectionComponent;
    let fixture: ComponentFixture<DispatchTablePreTripInspectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTablePreTripInspectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            DispatchTablePreTripInspectionComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
