import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsBrokerDetailsCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-broker-details-card/load-details-broker-details-card.component';

describe('LoadDetailsBrokerDetailsCardComponent', () => {
    let component: LoadDetailsBrokerDetailsCardComponent;
    let fixture: ComponentFixture<LoadDetailsBrokerDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsBrokerDetailsCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            LoadDetailsBrokerDetailsCardComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
