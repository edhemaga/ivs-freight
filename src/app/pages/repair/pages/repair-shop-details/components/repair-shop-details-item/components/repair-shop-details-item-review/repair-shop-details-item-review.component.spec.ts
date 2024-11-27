import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsItemReviewComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-review/repair-shop-details-item-review.component';

describe('RepairShopDetailsItemReviewComponent', () => {
    let component: RepairShopDetailsItemReviewComponent;
    let fixture: ComponentFixture<RepairShopDetailsItemReviewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsItemReviewComponent],
        });
        fixture = TestBed.createComponent(RepairShopDetailsItemReviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
