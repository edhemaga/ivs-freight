import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverEmploymentHistoryCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-employment-history-card/driver-employment-history-card.component';

describe('DriverEmploymentHistoryCardComponent', () => {
    let component: DriverEmploymentHistoryCardComponent;
    let fixture: ComponentFixture<DriverEmploymentHistoryCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverEmploymentHistoryCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverEmploymentHistoryCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
