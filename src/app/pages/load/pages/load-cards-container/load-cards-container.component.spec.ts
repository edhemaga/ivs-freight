import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCardsContainerComponent } from './load-cards-container.component';

describe('LoadCardsContainerComponent', () => {
    let component: LoadCardsContainerComponent;
    let fixture: ComponentFixture<LoadCardsContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadCardsContainerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadCardsContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
