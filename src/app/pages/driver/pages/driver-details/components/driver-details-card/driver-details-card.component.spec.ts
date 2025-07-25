import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/driver-details-card.component';

describe('DriverDetailsCardComponent', () => {
    let component: DriverDetailsCardComponent;
    let fixture: ComponentFixture<DriverDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DriverDetailsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DriverDetailsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
