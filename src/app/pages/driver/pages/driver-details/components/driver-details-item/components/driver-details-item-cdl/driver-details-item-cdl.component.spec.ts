import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsItemCdlComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-cdl/driver-details-item-cdl.component';

describe('DriverDetailsItemCdlComponent', () => {
    let component: DriverDetailsItemCdlComponent;
    let fixture: ComponentFixture<DriverDetailsItemCdlComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverDetailsItemCdlComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverDetailsItemCdlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
