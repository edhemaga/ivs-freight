import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaMapListCardComponent } from '@shared/components/ta-map-list-card/ta-map-list-card.component';

describe('TaMapListCardComponent', () => {
    let component: TaMapListCardComponent;
    let fixture: ComponentFixture<TaMapListCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaMapListCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaMapListCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
