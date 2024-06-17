import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverBankInfoCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-bank-info-card/driver-bank-info-card.component';

describe('DriverBankInfoCardComponent', () => {
    let component: DriverBankInfoCardComponent;
    let fixture: ComponentFixture<DriverBankInfoCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverBankInfoCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverBankInfoCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
