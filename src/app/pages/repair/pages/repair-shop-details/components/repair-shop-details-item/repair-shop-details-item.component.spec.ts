import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsItemComponent } from './repair-shop-details-item.component';

describe('RepairShopDetailsItemComponent', () => {
    let component: RepairShopDetailsItemComponent;
    let fixture: ComponentFixture<RepairShopDetailsItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RepairShopDetailsItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepairShopDetailsItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
