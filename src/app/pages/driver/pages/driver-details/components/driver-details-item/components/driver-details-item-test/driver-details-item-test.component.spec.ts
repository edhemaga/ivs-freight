import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsItemTestComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-test/driver-details-item-test.component';

describe('DriverDetailsItemTestComponent', () => {
    let component: DriverDetailsItemTestComponent;
    let fixture: ComponentFixture<DriverDetailsItemTestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverDetailsItemTestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverDetailsItemTestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
