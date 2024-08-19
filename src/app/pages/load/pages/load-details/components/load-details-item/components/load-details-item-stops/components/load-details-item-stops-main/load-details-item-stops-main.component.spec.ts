import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsItemStopsMainComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-details-item-stops-main/load-details-item-stops-main.component';

describe('LoadDetailsItemStopsMainComponent', () => {
    let component: LoadDetailsItemStopsMainComponent;
    let fixture: ComponentFixture<LoadDetailsItemStopsMainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsItemStopsMainComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsItemStopsMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
