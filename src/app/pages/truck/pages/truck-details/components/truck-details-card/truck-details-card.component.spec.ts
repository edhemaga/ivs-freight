import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDetailsCardComponent } from '@pages/truck/pages/truck-details/components/truck-details-card/truck-details-card.component';

describe('TruckDetailsCardComponent', () => {
    let component: TruckDetailsCardComponent;
    let fixture: ComponentFixture<TruckDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TruckDetailsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TruckDetailsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
