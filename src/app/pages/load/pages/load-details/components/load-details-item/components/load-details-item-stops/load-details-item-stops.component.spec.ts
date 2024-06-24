import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsItemStopsComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/load-details-item-stops.component';

describe('LoadDetailsItemStopsComponent', () => {
    let component: LoadDetailsItemStopsComponent;
    let fixture: ComponentFixture<LoadDetailsItemStopsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsItemStopsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsItemStopsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
