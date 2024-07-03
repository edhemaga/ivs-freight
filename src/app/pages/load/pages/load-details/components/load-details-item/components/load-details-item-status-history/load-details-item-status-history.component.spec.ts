import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsItemStatusHistoryComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-status-history/load-details-item-status-history.component';

describe('LoadDetailsItemStatusHistoryComponent', () => {
    let component: LoadDetailsItemStatusHistoryComponent;
    let fixture: ComponentFixture<LoadDetailsItemStatusHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsItemStatusHistoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            LoadDetailsItemStatusHistoryComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
