import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsItemMedicalComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-medical/driver-details-item-medical.component';

describe('DriverDetailsItemMedicalComponent', () => {
    let component: DriverDetailsItemMedicalComponent;
    let fixture: ComponentFixture<DriverDetailsItemMedicalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverDetailsItemMedicalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverDetailsItemMedicalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
