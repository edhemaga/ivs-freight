import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverEmergencyContactCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-emergency-contact-card/driver-emergency-contact-card.component';

describe('DriverEmergencyContactCardComponent', () => {
    let component: DriverEmergencyContactCardComponent;
    let fixture: ComponentFixture<DriverEmergencyContactCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverEmergencyContactCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverEmergencyContactCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
