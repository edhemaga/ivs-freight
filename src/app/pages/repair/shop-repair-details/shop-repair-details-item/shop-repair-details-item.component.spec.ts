import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopRepairDetailsItemComponent } from './shop-repair-details-item.component';

describe('ShopRepairDetailsItemComponent', () => {
    let component: ShopRepairDetailsItemComponent;
    let fixture: ComponentFixture<ShopRepairDetailsItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShopRepairDetailsItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShopRepairDetailsItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
