import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperCardViewComponent } from './shipper-card-view.component';

describe('ShipperCardViewComponent', () => {
    let component: ShipperCardViewComponent;
    let fixture: ComponentFixture<ShipperCardViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShipperCardViewComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShipperCardViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
