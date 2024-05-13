import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTooltipSlideComponent } from '@shared/components/ta-tooltip-slide/ta-tooltip-slide.component';

describe('TaTooltipSlideComponent', () => {
    let component: TaTooltipSlideComponent;
    let fixture: ComponentFixture<TaTooltipSlideComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTooltipSlideComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTooltipSlideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
