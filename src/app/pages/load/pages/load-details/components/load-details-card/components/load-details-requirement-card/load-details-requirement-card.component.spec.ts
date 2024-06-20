import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsRequirementCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-requirement-card/load-details-requirement-card.component';

describe('LoadDetailsRequirementCardComponent', () => {
    let component: LoadDetailsRequirementCardComponent;
    let fixture: ComponentFixture<LoadDetailsRequirementCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsRequirementCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsRequirementCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
