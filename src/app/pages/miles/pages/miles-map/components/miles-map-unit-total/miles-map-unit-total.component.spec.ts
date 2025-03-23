import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilesMapUnitTotalComponent } from '@pages/miles/pages/miles-map/components/miles-map-unit-total/miles-map-unit-total.component';

describe('MilesMapUnitTotalComponent', () => {
    let component: MilesMapUnitTotalComponent;
    let fixture: ComponentFixture<MilesMapUnitTotalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MilesMapUnitTotalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MilesMapUnitTotalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
