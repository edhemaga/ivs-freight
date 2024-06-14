import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOffDutyLocationCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-off-duty-location-card/driver-off-duty-location-card.component';

describe('DriverOffDutyLocationCardComponent', () => {
    let component: DriverOffDutyLocationCardComponent;
    let fixture: ComponentFixture<DriverOffDutyLocationCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverOffDutyLocationCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverOffDutyLocationCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
