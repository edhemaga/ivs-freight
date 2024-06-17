import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverNotificationCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-notification-card/driver-notification-card.component';

describe('DriverNotificationCardComponent', () => {
    let component: DriverNotificationCardComponent;
    let fixture: ComponentFixture<DriverNotificationCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverNotificationCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverNotificationCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
