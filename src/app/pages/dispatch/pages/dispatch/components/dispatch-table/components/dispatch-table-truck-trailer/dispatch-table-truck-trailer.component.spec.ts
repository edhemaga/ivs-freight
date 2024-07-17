import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableTruckTrailerComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-truck-trailer/dispatch-table-truck-trailer.component';

describe('DispatchTableTruckTrailerComponent', () => {
    let component: DispatchTableTruckTrailerComponent;
    let fixture: ComponentFixture<DispatchTableTruckTrailerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DispatchTableTruckTrailerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DispatchTableTruckTrailerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
