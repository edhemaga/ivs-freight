import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOwnerInfoCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-owner-info-card/driver-owner-info-card.component';

describe('DriverOwnerInfoCardComponent', () => {
    let component: DriverOwnerInfoCardComponent;
    let fixture: ComponentFixture<DriverOwnerInfoCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverOwnerInfoCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverOwnerInfoCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
