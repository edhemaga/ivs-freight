import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsAdditionalInfoCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-details-additional-info-card/driver-details-additional-info-card.component';

describe('DriverDetailsAdditionalInfoCardComponent', () => {
    let component: DriverDetailsAdditionalInfoCardComponent;
    let fixture: ComponentFixture<DriverDetailsAdditionalInfoCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverDetailsAdditionalInfoCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            DriverDetailsAdditionalInfoCardComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
