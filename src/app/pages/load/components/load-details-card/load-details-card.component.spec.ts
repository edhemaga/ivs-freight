import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsCardComponent } from './load-details-card.component';

describe('LoadDetailsCardComponent', () => {
    let component: LoadDetailsCardComponent;
    let fixture: ComponentFixture<LoadDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadDetailsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadDetailsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
