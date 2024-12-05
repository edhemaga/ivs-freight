import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsItemContactComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-contact/repair-shop-details-item-contact.component';

describe('RepairShopDetailsItemContactComponent', () => {
    let component: RepairShopDetailsItemContactComponent;
    let fixture: ComponentFixture<RepairShopDetailsItemContactComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsItemContactComponent],
        });
        fixture = TestBed.createComponent(
            RepairShopDetailsItemContactComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
