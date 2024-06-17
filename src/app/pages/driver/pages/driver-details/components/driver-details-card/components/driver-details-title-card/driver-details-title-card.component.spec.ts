import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsTitleCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-details-title-card/driver-details-title-card.component';

describe('DriverDetailsTitleCardComponent', () => {
    let component: DriverDetailsTitleCardComponent;
    let fixture: ComponentFixture<DriverDetailsTitleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverDetailsTitleCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverDetailsTitleCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
