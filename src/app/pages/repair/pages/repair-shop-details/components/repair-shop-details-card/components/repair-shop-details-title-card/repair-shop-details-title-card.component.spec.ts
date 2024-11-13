import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsTitleCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-title-card/repair-shop-details-title-card.component';

describe('RepairShopDetailsTitleCardComponent', () => {
    let component: RepairShopDetailsTitleCardComponent;
    let fixture: ComponentFixture<RepairShopDetailsTitleCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsTitleCardComponent],
        });
        fixture = TestBed.createComponent(RepairShopDetailsTitleCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
