import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilesMapUnitListComponent } from '@pages/miles/pages/miles-map/components/miles-map-unit-list/miles-map-unit-list.component';

describe('MilesMapUnitListComponent', () => {
    let component: MilesMapUnitListComponent;
    let fixture: ComponentFixture<MilesMapUnitListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MilesMapUnitListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MilesMapUnitListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
