import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTablePriTripInspectionComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-pri-trip-inspection/dispatch-table-pri-trip-inspection.component';

describe('DispatchTablePriTripInspectionComponent', () => {
    let component: DispatchTablePriTripInspectionComponent;
    let fixture: ComponentFixture<DispatchTablePriTripInspectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTablePriTripInspectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            DispatchTablePriTripInspectionComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
