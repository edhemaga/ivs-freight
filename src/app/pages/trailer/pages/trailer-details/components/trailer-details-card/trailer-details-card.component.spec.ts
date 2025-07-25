import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerDetailsCardComponent } from '@pages/trailer/pages/trailer-details/components/trailer-details-card/trailer-details-card.component';

describe('TrailerDetailsCardComponent', () => {
    let component: TrailerDetailsCardComponent;
    let fixture: ComponentFixture<TrailerDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TrailerDetailsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TrailerDetailsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
