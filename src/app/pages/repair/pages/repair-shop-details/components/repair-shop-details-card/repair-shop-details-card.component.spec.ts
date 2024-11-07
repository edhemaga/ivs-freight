import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsCard } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/repair-shop-details-card.component';

describe('RepairShopDetailsCard', () => {
    let component: RepairShopDetailsCard;
    let fixture: ComponentFixture<RepairShopDetailsCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RepairShopDetailsCard],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepairShopDetailsCard);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
