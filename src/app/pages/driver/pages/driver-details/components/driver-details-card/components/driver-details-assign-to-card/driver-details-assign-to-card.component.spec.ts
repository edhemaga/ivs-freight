import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsAssignToCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/components/driver-details-assign-to-card/driver-details-assign-to-card.component';

describe('DriverDetailsAssignToCardComponent', () => {
    let component: DriverDetailsAssignToCardComponent;
    let fixture: ComponentFixture<DriverDetailsAssignToCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverDetailsAssignToCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverDetailsAssignToCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
