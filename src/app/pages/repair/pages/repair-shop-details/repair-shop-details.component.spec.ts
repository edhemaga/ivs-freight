import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsComponent } from './repair-shop-details.component';

describe('RepairShopDetailsComponent', () => {
    let component: RepairShopDetailsComponent;
    let fixture: ComponentFixture<RepairShopDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RepairShopDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepairShopDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
