import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsItemMvrComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-mvr/driver-details-item-mvr.component';

describe('DriverDetailsItemMvrComponent', () => {
    let component: DriverDetailsItemMvrComponent;
    let fixture: ComponentFixture<DriverDetailsItemMvrComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverDetailsItemMvrComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverDetailsItemMvrComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
