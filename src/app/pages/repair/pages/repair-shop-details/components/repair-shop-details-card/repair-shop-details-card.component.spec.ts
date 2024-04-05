import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopCardViewComponent } from './repair-shop-details-card.component';

describe('RepairShopCardViewComponent', () => {
    let component: RepairShopCardViewComponent;
    let fixture: ComponentFixture<RepairShopCardViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RepairShopCardViewComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepairShopCardViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
