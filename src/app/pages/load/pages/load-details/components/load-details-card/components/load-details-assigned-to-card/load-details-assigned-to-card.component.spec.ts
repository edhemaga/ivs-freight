import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsAssignedToCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-assigned-to-card/load-details-assigned-to-card.component';

describe('LoadDetailsAssignedToCardComponent', () => {
    let component: LoadDetailsAssignedToCardComponent;
    let fixture: ComponentFixture<LoadDetailsAssignedToCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsAssignedToCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsAssignedToCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
