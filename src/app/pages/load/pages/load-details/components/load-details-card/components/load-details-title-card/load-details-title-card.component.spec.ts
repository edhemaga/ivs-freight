import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsTitleCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-title-card/load-details-title-card.component';

describe('LoadDetailsTitleCardComponent', () => {
    let component: LoadDetailsTitleCardComponent;
    let fixture: ComponentFixture<LoadDetailsTitleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsTitleCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsTitleCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
