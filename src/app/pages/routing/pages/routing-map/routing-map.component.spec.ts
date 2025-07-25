import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingMapComponent } from '@pages/routing/pages/routing-map/routing-map.component';

describe('RoutingMapComponent', () => {
    let component: RoutingMapComponent;
    let fixture: ComponentFixture<RoutingMapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RoutingMapComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RoutingMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
