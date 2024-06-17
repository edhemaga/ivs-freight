import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPayTypesCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-pay-types-card/driver-pay-types-card.component';

describe('DriverPayTypesCardComponent', () => {
    let component: DriverPayTypesCardComponent;
    let fixture: ComponentFixture<DriverPayTypesCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverPayTypesCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverPayTypesCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
