import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsItemStopsProgressBarComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-details-item-stops-progress-bar/load-details-item-stops-progress-bar.component';

describe('LoadDetailsItemStopsProgressBarComponent', () => {
    let component: LoadDetailsItemStopsProgressBarComponent;
    let fixture: ComponentFixture<LoadDetailsItemStopsProgressBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsItemStopsProgressBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            LoadDetailsItemStopsProgressBarComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
